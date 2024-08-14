import { makeService } from '../../services/service';
import { AuthApi } from './auth.api';
import { LoginDTO } from './dto/login';
import { AppState } from '../../services/app-store';
import { AppLocalStorage } from '../../services/storage';
import { useService } from '../../hooks/useService';
import { MeServiceProvider } from '../me/me.service';

export const LOGOUT = 'LOGOUT';
const logoutAction = {
  type: LOGOUT
};

export const AuthServiceProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const selectedCompany = AppLocalStorage.of<string>('selectedCompany');
    const MeService = useService(MeServiceProvider);
    return {
      async getCode(phone: string) {
        return AuthApi.GetCode(phone);
      },

      async authorize(phone: string, code: string) {
        return AuthApi.Authorize(phone, code);
      },

      async login(loginData: LoginDTO) {
        AuthApi.setTokens(loginData.accessToken, loginData.refreshToken);
        MeService.getCurrentUserInfo();
      },

      async logout() {
        await AuthApi.Logout();
        selectedCompany.reset(null);
        dispatch(logoutAction);
        AuthApi.setTokens(undefined, undefined);
      }
    };
  }
);
