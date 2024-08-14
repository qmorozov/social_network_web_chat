import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FaqDTO } from '../dto/faq';

export interface IFaqItem {
  language?: string | null;
  faqQuestions: FaqDTO[];
  loading: boolean;
}

const initialState: IFaqItem = {
  language: null,
  faqQuestions: [],
  loading: false
};

export const FaqQuestionsSlice = createSlice({
  name: 'faqQuestions',
  initialState,
  reducers: {
    setFaq(
      state,
      { payload }: PayloadAction<{ faqQuestions: FaqDTO[]; language: string }>
    ) {
      state.faqQuestions = payload.faqQuestions;
      state.language = payload.language;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    }
  }
});

const FaqQuestionsReducer = FaqQuestionsSlice.reducer;

export default FaqQuestionsReducer;
