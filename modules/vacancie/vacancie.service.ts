import { makeService } from '../../services/service';
import { VacancieSlice } from './stores/vacancie.store';
import { VacancieApi } from './vacancie.api';
import { AppState } from '../../services/app-store';

export const VacancieProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getVacancie(businessId: string) {
        const jobs = await VacancieApi.getJobs(businessId);
        dispatch(VacancieSlice.actions.setJobs(jobs));
      },
      async getJob(jobId: string | string[] | undefined) {
        return await VacancieApi.getJobId(jobId);
      },
      async deleteJob(jobId: string | string[] | undefined) {
        return await VacancieApi.deleteJob(jobId);
      },
      async putJob(jobId: string | string[] | undefined) {
        const data = {
          ...appState.account.resume
        };
        return await VacancieApi.putJob(jobId, data);
      },

      async postVacancie(businessId: string | null) {
        const data = {
          ...appState.account.resume
        };
        await VacancieApi.postJob(businessId, data);
      }
    };
  }
);
