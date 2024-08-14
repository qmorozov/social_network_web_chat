import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyDTO } from '../dto/company';

interface ICompanyState {
  company: CompanyDTO | null;
}

const initialState: ICompanyState = {
  company: null
};

export const CompanySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompany(state, action: PayloadAction<CompanyDTO>) {
      return {
        ...state,
        company: action.payload
      };
    }
  }
});

export const CompanyReducer = CompanySlice.reducer;

export default CompanyReducer;
