import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { CompanyDTO } from '../../company/dto/company';

type SearchHistory = {
  query: string;
};

interface IMap {
  updated: boolean;
  latitude: number;
  longitude: number;
  accuracy?: number;
  zoom?: number;
  selectedCategoryId: string | null;
  selectedCategoryGroupId: string | null;
  searchInput: string;
  searchHistory: SearchHistory[];
  isHistoryLoaded: boolean;
  companiesFilter: string | null;
  hoveredCompany: any | null;
  showOnMap: {
    show: boolean;
    coords: {
      lat: number;
      lng: number;
    };
  };
}

const initialState: IMap = {
  updated: false,
  latitude: 0,
  longitude: 0,
  zoom: 16,
  selectedCategoryId: null,
  selectedCategoryGroupId: null,
  searchInput: '',
  searchHistory: [],
  isHistoryLoaded: false,
  companiesFilter: null,
  hoveredCompany: null,
  showOnMap: {
    show: false,
    coords: {
      lat: 0,
      lng: 0
    }
  }
};

export const MapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapPosition(state, location: PayloadAction<Partial<IMap>>) {
      return { ...state, ...location.payload };
    },
    updateMapPosition(state, location: PayloadAction<Partial<IMap>>) {
      return { ...state, ...location.payload, updated: true };
    },
    setShowOnMap(state, action: PayloadAction<IMap['showOnMap']>) {
      return {
        ...state,
        showOnMap: action.payload
      };
    },
    setCategoryId(state, action: PayloadAction<string | null>) {
      console.log(action.payload);

      return {
        ...state,
        selectedCategoryId: action.payload
      };
    },
    setCategoryGroupId(state, action: PayloadAction<string | null>) {
      return {
        ...state,
        selectedCategoryGroupId: action.payload
      };
    },
    setSearchInput(state, action: PayloadAction<string>) {
      return {
        ...state,
        searchInput: action.payload
      };
    },
    setSearchHistory(state, action: PayloadAction<SearchHistory[]>) {
      return {
        ...state,
        searchHistory: action.payload,
        isHistoryLoaded: true
      };
    },
    setCompaniesFilter(state, action: PayloadAction<string | null>) {
      return {
        ...state,
        companiesFilter: action.payload
      };
    },
    setHoveredCompany(state, action: PayloadAction<any | null>) {
      return {
        ...state,
        hoveredCompany: action.payload
      };
    }
  },

  extraReducers: {
    [HYDRATE](state, action) {
      if (action.payload?.map && !state.updated) {
        return (state = { ...state, ...(action.payload?.map || {}) });
      }
    }
  }
});

export const MapReducer = MapSlice.reducer;

export default MapReducer;
