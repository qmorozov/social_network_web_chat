import { makeService } from '../../../services/service';
import { CategoryListSlice } from '../store/category-list';
import { BusinessApi } from '../company.api';
import { AppState } from '../../../services/app-store';

export const CategoryListProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getCategoryList(lang: string) {
        dispatch(CategoryListSlice.actions.setLoading(true));
        try {
          const cat = await BusinessApi.GetCategoryList(lang);
          dispatch(
            CategoryListSlice.actions.set({ categoryList: cat, language: lang })
          );
        } catch (e) {
          console.log(e);
        } finally {
          dispatch(CategoryListSlice.actions.setLoading(false));
        }
      }
    };
  }
);
