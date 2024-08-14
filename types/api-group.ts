import axios from 'axios';
import { AppLocalStorage } from '../services/storage';

export abstract class ApiGroup {
  protected static __accessToken = AppLocalStorage.of<string>('ux.bs.at');

  protected static __refreshToken = AppLocalStorage.of<string>('ux.bs.rt');

  protected static __instance = (() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL
    });

    instance.interceptors.request.use(
      (config) => {
        const token = ApiGroup.__accessToken.get();
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = token;
          config.headers['Content-Type'] = 'application/json';
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  })();

  protected get get() {
    return ApiGroup.__instance.get;
  }

  protected get post() {
    return ApiGroup.__instance.post;
  }

  protected get put() {
    return ApiGroup.__instance.put;
  }

  protected get delete() {
    return ApiGroup.__instance.delete;
  }

  protected async sendOk<P extends Record<string, any>>(
    payload?: P
  ): Promise<P> {
    return { ok: true, ...(payload || {}) } as unknown as P;
  }

  protected get accessToken() {
    return ApiGroup.__accessToken.get();
  }

  protected set accessToken(token: string | undefined) {
    ApiGroup.__accessToken.reset(token);
  }

  protected set refreshToken(token: string | undefined) {
    ApiGroup.__refreshToken.reset(token);
  }
}
