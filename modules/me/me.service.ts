import { makeService } from '../../services/service';
import { MeApi } from './me.api';
import { AppState } from '../../services/app-store';
import { UserSlice } from './store/me';
import { UserDTO } from '../auth/dto/user';
import { ChatixService } from '../chatix/chatix.service';
import { AppLocalStorage } from '../../services/storage';

export const LOGOUT = 'LOGOUT';
const logoutAction = {
  type: LOGOUT
};

export const MeServiceProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const selectedCompany = AppLocalStorage.of<string>('selectedCompany');
    return {
      async getCurrentUserInfo() {
        dispatch(UserSlice.actions.setLoading());
        const userInfo = await MeApi.GetCurrentUserInfo();
        dispatch(UserSlice.actions.setUser(userInfo));
        return userInfo;
      },

      async init() {
        dispatch(UserSlice.actions.setInit(true));
        dispatch(
          UserSlice.actions.setSelectedCompany(
            AppLocalStorage.get('selectedCompany')
          )
        );
        if (!appState.user.loading) {
          return this.getCurrentUserInfo().then((user) => {
            this.connectToChatix(user);
          });
        }
      },

      async connectToChatix(user?: UserDTO) {
        if (user && !ChatixService.connected) {
          return ChatixService.connect(user);
        }
      },

      async setName(name: string) {
        await MeApi.SetName(name);
        dispatch(UserSlice.actions.setName(name));
        return name;
      },

      async setPhoto(Photo: any) {
        await MeApi.SetPhoto(Photo);
        if (!appState.user.loading) {
          return this.getCurrentUserInfo();
        }
      },

      setSelectedCompany(id: string | null) {
        dispatch(UserSlice.actions.setSelectedCompany(id));
        selectedCompany.reset(id);
        dispatch(logoutAction);
      },

      validUser(user?: UserDTO): boolean {
        return !!user?.name?.length;
      }
    };
  }
);
