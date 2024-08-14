import { useEffect } from 'react';
import Loader from '../../../component/loader/Loader';
import { useService } from '../../../hooks/useService';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { CategoryListProvider } from '../../company/services/company-categories.service';
import { useAuth } from '../../../hooks/useAuth';
import Style from './MapCategoryList.module.scss';
import { useActions } from '../../../hooks/useActions';
import { MapSlice } from '../store/map';

export default function MapCategoryList() {
  const { categoryList, loading, language } = useTypedSelector(
    (state) => state.categoryList
  );
  const { selectedCategoryId, selectedCategoryGroupId } = useTypedSelector(
    (state) => state.map
  );

  const { setCategoryGroupId, setCategoryId } = useActions(MapSlice);

  const { selectedLanguage } = useAuth();
  const { getCategoryList } = useService(CategoryListProvider);

  useEffect(() => {
    if (language !== selectedLanguage || (!categoryList.length && !loading)) {
      getCategoryList(selectedLanguage);
    }
  }, []);

  const categorySelectHandler = (id: string) => {
    if (id === selectedCategoryId) {
      setCategoryId(null);
    } else {
      setCategoryGroupId(null);
      setCategoryId(id);
    }
  };
  const categoryGroupSelectHandler = (id: string) => {
    if (id === selectedCategoryGroupId) {
      setCategoryGroupId(null);
    } else {
      setCategoryId(null);
      setCategoryGroupId(id);
    }
  };

  if (loading) return <Loader />;

  return (
    <ul className={['al-side-content-scroll', Style.CategoryList].join(' ')}>
      {categoryList.map((category) => {
        return (
          <li
            key={category.id}
            className={
              selectedCategoryGroupId && category.id === selectedCategoryGroupId
                ? Style.ActiveCategoryGroup
                : ''
            }
          >
            <a
              className={Style.CategoryGroup}
              onClick={() => {
                categoryGroupSelectHandler(category.id);
              }}
            >
              {category.name}
            </a>
            {category.categories?.length ? (
              <ul className={Style.CategoryPillsList}>
                {category.categories.map((subCategory) => (
                  <li
                    key={subCategory.id}
                    className={
                      selectedCategoryId &&
                      subCategory.id === selectedCategoryId
                        ? Style.ActiveCategory
                        : ''
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      categorySelectHandler(subCategory.id);
                    }}
                  >
                    <a className="pill">{subCategory.name}</a>
                  </li>
                ))}
              </ul>
            ) : undefined}
          </li>
        );
      })}
    </ul>
  );
}
