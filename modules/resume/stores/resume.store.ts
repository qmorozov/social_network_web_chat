import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResume } from '../../account/dto/Account';

export interface IResumeItem {
  resume: IResume | null;
}

const initialState: IResumeItem = {
  resume: null
};

export const ResumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResume(state, { payload }: PayloadAction<IResume>) {
      state.resume = payload;
    }
  }
});

const ResumeReducer = ResumeSlice.reducer;

export default ResumeReducer;
