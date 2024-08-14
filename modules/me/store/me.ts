import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '../../auth/dto/user';
import { HYDRATE } from 'next-redux-wrapper';

export enum PositionSource {
  navigator = 'navigator',
  api = 'api'
}

type Position = keyof typeof PositionSource;

interface IUser {
  signed: boolean;
  user?: UserDTO;
  loading: boolean;
  init: boolean;
  selectedLanguage: string;
  updated: boolean;
  latitude: number;
  longitude: number;
  accuracy?: number;
  positionSource: Position | null;
  selectedCompany: string | null;
}

export const initialState: IUser = {
  signed: false,
  loading: false,
  init: false,
  selectedLanguage: 'en',
  updated: false,
  latitude: 0,
  longitude: 0,
  positionSource: null,
  selectedCompany: ''
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    setInit(state, { payload }: PayloadAction<boolean>) {
      state.init = !!payload;
    },
    setUser(state, action: PayloadAction<UserDTO>) {
      return {
        ...state,
        user: action.payload,
        signed: !!action.payload,
        loading: false
      };
    },
    removeUser(state) {
      state.user = undefined;
      state.signed = false;
      state.loading = false;
    },
    setLanguage(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedLanguage: action.payload
      };
    },
    setName(state, action: PayloadAction<string>) {
      const user = state.user
        ? ({ ...state.user, name: action.payload } as UserDTO)
        : undefined;
      return {
        ...state,
        user,
        signed: !!user
      };
    },
    setPhoto(state, action: PayloadAction<any>) {
      const user = state.user
        ? { ...state.user, Photo: action.payload }
        : undefined;
      return {
        ...state,
        user,
        signed: !!user
      };
    },
    setUserPosition(state, location: PayloadAction<Partial<IUser>>) {
      return (state = { ...state, ...location.payload });
    },
    updateUserPosition(state, location: PayloadAction<Partial<IUser>>) {
      return (state = { ...state, ...location.payload, updated: true });
    },
    setSelectedCompany(state, action: PayloadAction<string | null>) {
      return {
        ...state,
        selectedCompany: action.payload
      };
    }
  },
  extraReducers: {
    [HYDRATE](state, action) {
      if (action.payload?.user && !state.updated) {
        return (state = { ...state, ...(action.payload?.user || {}) });
      }
    }
  }
});

const UserReducer = UserSlice.reducer;

export default UserReducer;
