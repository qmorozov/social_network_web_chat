import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfferBusinessesnDTO, OffersDTO } from '../dto/feed';

export interface IFeedItem {
  loading: boolean;
  offerBusinesses: OfferBusinessesnDTO[];
  offers: OffersDTO[];
}

const initialState: IFeedItem = {
  offerBusinesses: [],
  offers: [],
  loading: false
};

export const FeedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOfferBusinesses(state, { payload }: PayloadAction<any>) {
      state.offerBusinesses = payload;
    },
    setOffers(state, { payload }: PayloadAction<any>) {
      state.offers = payload.offers;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    }
  }
});

const FeedReducer = FeedSlice.reducer;

export default FeedReducer;
