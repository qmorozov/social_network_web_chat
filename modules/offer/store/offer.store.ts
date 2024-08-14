import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IOfferSubscription {
  id: string | number;
  name: string;
}

interface IOffer {
  OfferSubscription: Array<IOfferSubscription>;
}

const initialState: IOffer = {
  OfferSubscription: []
};

export const OfferSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setOfferSubscribe(
      state,
      {
        payload
      }: PayloadAction<{ OfferSubscription: Array<IOfferSubscription> }>
    ) {
      return {
        ...state,
        OfferSubscription: payload.OfferSubscription
      };
    }
  }
});

const OfferReducer = OfferSlice.reducer;

export default OfferReducer;
