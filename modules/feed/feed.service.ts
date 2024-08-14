import { makeService } from '../../services/service';
import { FeedSlice } from './stores/feed.store';
import { FeedApi } from './feed.api';
import { AppState } from '../../services/app-store';

export const FeedProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getOfferBusinesses() {
        dispatch(FeedSlice.actions.setLoading(true));
        try {
          const offerBusinesses = await FeedApi.getOfferBusinesses();
          dispatch(FeedSlice.actions.setOfferBusinesses(offerBusinesses));
        } catch (e) {
          // todo page show error
        } finally {
          dispatch(FeedSlice.actions.setLoading(false));
        }
      },
      async getOffers() {
        dispatch(FeedSlice.actions.setLoading(true));
        try {
          const offerSubscription = await FeedApi.getOfferSubscription();
          dispatch(FeedSlice.actions.setOffers(offerSubscription));
        } catch (e) {
          // todo page show error
        } finally {
          dispatch(FeedSlice.actions.setLoading(false));
        }
      },
      async putUnsubscribe(businessId: string) {
        try {
          await FeedApi.putUnsubscribe(businessId);
        } catch (e) {
          // todo page show error
        }
      },
      async postSubscribe(businessId: string) {
        try {
          await FeedApi.postSubscribe(businessId);
        } catch (e) {
          // todo page show error
        }
      }
    };
  }
);
