import { makeService } from '../../../services/service';
import { BusinessApi } from '../company.api';
import { AppState } from '../../../services/app-store';

export const CompanyLikeProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getCompany(businessId: any) {
        try {
          const company = await BusinessApi.getCompanyById(businessId);
          return company;
        } catch (e) {
          console.log(e);
        }
      },
      async deleteCompany(businessId: any) {
        try {
          await BusinessApi.deleteCompanyById(businessId);
        } catch (e) {
          console.log(e);
        }
      },
      async postLikeBusiness(businessId: string, isLikes: boolean) {
        try {
          if (isLikes) {
            await BusinessApi.PostUnLikeBusiness(businessId);
          } else {
            await BusinessApi.PostLikeBusiness(businessId);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
  }
);
