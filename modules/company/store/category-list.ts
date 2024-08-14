import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Category = {
  id: string;
  name: string;
  categories: [
    {
      id: string;
      name: string;
    }
  ];
};

interface ICategoryList {
  categoryList: Category[];
  language?: string | null;
  loading: boolean;
}

const initialState: ICategoryList = {
  categoryList: [],
  language: null,
  loading: true
};

export const CategoryListSlice = createSlice({
  name: 'categoryList',
  initialState,
  reducers: {
    set(
      state,
      action: PayloadAction<{ categoryList: Category[]; language: string }>
    ) {
      return {
        ...state,
        categoryList: action.payload.categoryList,
        language: action.payload.language
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

export const CategoryListReducer = CategoryListSlice.reducer;

export default CategoryListReducer;
