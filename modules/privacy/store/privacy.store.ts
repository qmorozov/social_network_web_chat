import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IPrivacyPolicy {
  language?: string | null;
  privacyPolicy: string;
  loading: boolean;
}

const initialState: IPrivacyPolicy = {
  language: null,
  privacyPolicy: '',
  loading: true
};

export const PrivacyPolicySlice = createSlice({
  name: 'privacyPolicy',
  initialState,
  reducers: {
    setPrivacyPolicy(
      state,
      { payload }: PayloadAction<{ privacyPolicy: string; language: string }>
    ) {
      state.privacyPolicy = payload.privacyPolicy;
      state.language = payload.language;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    }
  }
});

const PrivacyPolicyReducer = PrivacyPolicySlice.reducer;

export default PrivacyPolicyReducer;
