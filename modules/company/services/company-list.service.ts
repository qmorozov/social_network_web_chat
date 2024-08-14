import { makeService } from '../../../services/service';
import { CompanyAccountsSlice } from '../store/company-list';
import { BusinessApi, IBusiness } from '../company.api';
import { AppState } from '../../../services/app-store';

export const CompanyAccountsListProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const isAuth = appState.user.signed;
    return {
      async getBusinessAccountsList({
        latlng,
        radius,
        categoryGroupId,
        categoryId,
        query,
        lat = 0,
        lng = 0,
        userCoordinates = {
          lat: 0,
          lng: 0
        }
      }: IBusiness) {
        // if (!isAuth) return;
        dispatch(CompanyAccountsSlice.actions.setLoading(true));

        await BusinessApi.GetBusinessAccounts({
          latlng,
          radius,
          categoryGroupId,
          categoryId,
          query
        })
          .catch((err) => {
            if (err) {
              console.error(err);
            }
          })
          .then((res) => {
            dispatch(
              CompanyAccountsSlice.actions.set({
                companies: res?.businesses || [],
                lat,
                lng,
                userCoordinates
              })
            );
          })
          .finally(() => {
            dispatch(CompanyAccountsSlice.actions.setLoading(false));
          });
      }
    };
  }
);
