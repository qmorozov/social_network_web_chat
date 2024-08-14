import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IVacancieItem {
  loading: boolean;
  jobs: any;
}

const initialState: IVacancieItem = {
  jobs: [],
  loading: false
};

export const VacancieSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs(state, { payload }: PayloadAction<any>) {
      state.jobs = payload;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    }
  }
});

const VacancieReducer = VacancieSlice.reducer;

export default VacancieReducer;
