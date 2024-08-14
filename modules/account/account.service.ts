import { makeService } from '../../services/service';
import { AppState } from '../../services/app-store';
import { AccountSlice } from './store/account.store';
import { AccountAPI } from './account.api';
import { AppLocalStorage } from '../../services/storage';
import { useService } from '../../hooks/useService';
import { MeServiceProvider } from '../me/me.service';
import { ResumeSlice } from '../resume/stores/resume.store';

export const Account = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const MeService = useService(MeServiceProvider);
    return {
      async getCurrency() {
        try {
          const currency = await AccountAPI.getCurrency();
          dispatch(AccountSlice.actions.setCurrency(currency));
        } catch (e) {
          // todo page show error
        }
      },

      async getUnit() {
        try {
          const unit = await AccountAPI.getUnit();
          dispatch(AccountSlice.actions.setUnit(unit));
        } catch (e) {
          // todo page show error
        }
      },

      async getResume(userId?: string) {
        try {
          const resume = await AccountAPI.getResume(userId);
          dispatch(ResumeSlice.actions.setResume(resume));
          return resume;
        } catch (e) {
          // todo page show error
        }
      },
      async editResume() {
        const data = {
          ...appState.account.resume
        };
        return AccountAPI.editResume(data);
      },

      async postResume() {
        const data = {
          ...appState.account.resume
        };
        return AccountAPI.postResume(data);
      },
      async deleteResume() {
        return AccountAPI.deleteResume();
      },

      async postDescription(company: any) {
        const companyId = AppLocalStorage.get('selectedCompany');
        if (companyId) {
          const data = {
            ...company,
            ...appState.account.description,
            schedules: [
              {
                ...company.schedules[0],
                daysMask: 127
              }
            ]
          };
          await AccountAPI.postDescriptionCompanyById(
            companyId as string,
            data
          );
        } else {
          const data = {
            ...appState.account.description
          };

          await AccountAPI.postDescription(data);
        }
        await MeService.getCurrentUserInfo();
      },

      async postOffer() {
        const data = {
          ...appState.account.offer,
          attachments: [
            ...appState.account.attachments.map((attachment) => attachment.id)
          ]
        };
        return AccountAPI.postOffer(data);
      },

      async addOfferAttachment(Attachment: any) {
        try {
          const attachment = await AccountAPI.postOfferAttachment(Attachment);
          dispatch(AccountSlice.actions.setAttachment(attachment));
        } catch (e) {
          // todo page show error
        }
      },

      async deleteOfferAttachment(id: string) {
        try {
          await AccountAPI.deleteOfferAttachment(id);
        } catch (e) {
          // todo page show error
        }
      }
    };
  }
);
