import { makeService } from '../../services/service';
import { AppState } from '../../services/app-store';
import { PrivacyPolicySlice } from './store/privacy.store';
import { privacyPolicyAPI } from './privacy.api';

export const PrivacyPolicy = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getPrivacyPolicy(selectedLanguage: string) {
        dispatch(PrivacyPolicySlice.actions.setLoading(true));
        try {
          const privacy = await privacyPolicyAPI.getPrivacyPolicy(
            selectedLanguage
          );
          dispatch(
            PrivacyPolicySlice.actions.setPrivacyPolicy({
              privacyPolicy: privacy,
              language: selectedLanguage
            })
          );
        } catch (e) {
          ///
        } finally {
          dispatch(PrivacyPolicySlice.actions.setLoading(false));
        }
      }
    };
  }
);
