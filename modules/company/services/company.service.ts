import { makeService } from '../../../services/service';
import { AppState } from '../../../services/app-store';
import { BusinessApi } from '../company.api';
import { MeServiceProvider } from '../../me/me.service';
import { useService } from '../../../hooks/useService';

export const CompanyProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const MeService = useService(MeServiceProvider);
    return {
      async setPhoto(Photo: FormData, id: string) {
        await BusinessApi.SetPhoto(Photo, id);
        MeService.getCurrentUserInfo();
      }
    };
  }
);
