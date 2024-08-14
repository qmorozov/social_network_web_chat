import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyDTO } from '../dto/company';
import addFilterFilelds from '../utility';

interface IbusinessAccountsMapList {
  loading: boolean;
  companyAccountsList: CompanyDTO[];
  lat: number;
  lng: number;
}

type CompaniesPayload = {
  companies: CompanyDTO[];
  lat: number;
  lng: number;
  userCoordinates: {
    lat: number;
    lng: number;
  };
};

const initialState: IbusinessAccountsMapList = {
  loading: true,
  companyAccountsList: [],
  lat: 0,
  lng: 0
};

export const CompanyAccountsSlice = createSlice({
  name: 'companyAccountsList',
  initialState,
  reducers: {
    set(state, action: PayloadAction<CompaniesPayload>) {
      return {
        ...state,
        companyAccountsList: addFilterFilelds(
          action.payload.companies,
          action.payload.userCoordinates
        ) as CompanyDTO[],
        lat: action.payload.lat,
        lng: action.payload.lng
      };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        loading: action.payload
      };
    }
  }
});

export const CompanyAccountsReducer = CompanyAccountsSlice.reducer;

export default CompanyAccountsReducer;
