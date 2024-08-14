import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ICurrency,
  IResume,
  IOffer,
  IUnit,
  IAttachments,
  IDescription
} from '../dto/Account';

interface IAccount {
  currency: ICurrency[];
  unit: IUnit[];
  attachments: IAttachments[];
  resume: IResume;
  offer: IOffer;
  description: IDescription;
}

const initialState: IAccount = {
  currency: [],
  unit: [],
  attachments: [],
  resume: {
    title: '',
    description: '',
    salaryFrom: 0,
    salaryTo: 0,
    currencyId: '',
    address: '',
    lat: 0,
    lng: 0
  },
  offer: {
    description: '',
    price: 0,
    currencyId: '',
    unitId: '',
    categoryId: '',
    zipCode: ' ',
    country: ' ',
    administrativeArea: ' ',
    locality: ' ',
    address: '',
    lat: 0,
    lng: 0,
    businessId: ' '
  },
  description: {
    description: '',
    website: '',
    email: '',
    name: ''
  }
};

export const AccountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setCurrency(state, { payload }: PayloadAction<ICurrency[]>) {
      return {
        ...state,
        currency: payload
      };
    },

    setUnit(state, { payload }: PayloadAction<IUnit[]>) {
      return {
        ...state,
        unit: payload
      };
    },

    setResume(state, { payload }: PayloadAction<IResume>) {
      return {
        ...state,
        resume: payload
      };
    },

    setOffer(state, { payload }: PayloadAction<IOffer>) {
      return {
        ...state,
        offer: { ...state.offer, ...payload }
      };
    },
    setDescription(state, { payload }: PayloadAction<IDescription>) {
      return {
        ...state,
        description: { ...state.description, ...payload }
      };
    },
    setAttachment(state, { payload }: PayloadAction<IAttachments>) {
      return {
        ...state,
        attachments: [...state.attachments, { ...payload }]
      };
    },
    deleteAttachment(state, { payload }: PayloadAction<any>) {
      const newAttachments = state.attachments.filter((attachment) => {
        return attachment.id !== payload;
      });
      return {
        ...state,
        attachments: [...newAttachments]
      };
    }
  }
});

const AccountReducer = AccountSlice.reducer;

export default AccountReducer;
