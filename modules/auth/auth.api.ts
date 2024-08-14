import { ApiGroup } from '../../types/api-group';
import { UserDTO } from './dto/user';

export const AuthApi = new (class AuthApi extends ApiGroup {
  async Authorize(phone: string, code: string): Promise<UserDTO> {
    return (
      await this.post('Auth', {
        phone,
        code,
        deviceName: navigator.userAgent,
        firebaseToken: process.env.NEXT_PUBLIC_FIREBASE_TOKEN,
        locale: 'en'
      })
    )?.data;
  }

  async Logout() {
    return this.post('Logout');
  }

  async GetCode(phone: string) {
    return this.post('auth/GetCode', { phone });
  }

  setTokens(accessToken: string | undefined, refreshToken: string | undefined) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
})();
