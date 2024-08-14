import { makeService } from '../../services/service';
import { AppState } from '../../services/app-store';
import { OfferSlice } from './store/offer.store';

export const OfferService = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async setOfferSubscribe(businessId: string | number) {
        // dispatch(OfferSlice.setOfferSubscribe(businessId));
      }
    };
  }
);
