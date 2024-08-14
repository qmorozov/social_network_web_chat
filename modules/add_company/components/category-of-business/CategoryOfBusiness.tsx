import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';
import SelectList, {
  SelectItem
} from '../../../../component/select-list/Select';
import { useAuth } from '../../../../hooks/useAuth';
import { useDropDown } from '../../../../hooks/useDropDown';
import { useService } from '../../../../hooks/useService';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { CategoryListProvider } from '../../../company/services/company-categories.service';
import BtnOpenSelect from '../btn-open-select/BtnOpenSelect';
import Style from './CategoryOfBusiness.module.scss';

interface ICategoryOfBusiness {
  onChangeCategory: (category: SelectItem) => void;
}

const CategoryOfBusiness: FC<ICategoryOfBusiness> = ({ onChangeCategory }) => {
  const { t } = useTranslation();

  const { categoryList, loading, language } = useTypedSelector(
    (state) => state.categoryList
  );

  const [valueCategory, setValueCategory] = useState('');

  const refactorList = categoryList.map(
    (l) =>
      ({
        id: l.id,
        content: l.name,
        sublist: l.categories.map((sub) => ({
          id: sub.id,
          content: sub.name
        }))
      } as SelectItem)
  );

  const [filteredList, setFilteredList] = useState<SelectItem[]>(
    refactorList as SelectItem[]
  );
  const [searchInput, setSearchInput] = useState<string>('');
  const { opened, open, close } = useDropDown();

  useEffect(() => {
    const filterList = (list: SelectItem[]) => {
      return list.map((li) => {
        if (li?.sublist) {
          filterList(li.sublist);
        }

        if (!li?.sublist) {
          li.show = li.content
            .toLowerCase()
            .includes(searchInput.toLowerCase());
        }

        li.show = li?.sublist
          ? li?.sublist.some((v) => v?.show === true) ||
            li.content.toLowerCase().includes(searchInput.toLowerCase())
          : li.content.toLowerCase().includes(searchInput.toLowerCase());

        return li;
      });
    };

    setFilteredList(filterList(refactorList as SelectItem[]));
  }, [searchInput, categoryList]);

  const selectHandler = (category: SelectItem) => {
    onChangeCategory(category);
    setValueCategory(category.content);
    close();
  };

  const { selectedLanguage } = useAuth();
  const { getCategoryList } = useService(CategoryListProvider);
  useEffect(() => {
    if (language !== selectedLanguage || (!categoryList.length && !loading)) {
      getCategoryList(selectedLanguage);
    }
  }, []);

  return (
    <div className="form-control -column">
      <div onClick={() => (opened ? close() : open())}>
        <BtnOpenSelect
          title={valueCategory || t('add-company.category-of-business.title')}
        />
      </div>
      <div
        className={[
          Style.Categories,
          opened ? Style.ShowCategories : Style.HideCategories
        ].join(' ')}
      >
        <div className={Style.SearchBlock}>
          <input
            type="text"
            value={searchInput}
            placeholder={t('add-company.category-of-business.placeholder')}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Icon id="search" />
        </div>

        {filteredList.some((l) => l.show) ? (
          <SelectList
            items={filteredList as SelectItem[]}
            isOpen={searchInput.length > 0}
            onOptionSelect={selectHandler}
            search={searchInput}
            itemClassName={Style.SelectListItem}
            listClassName={Style.SelectList}
          />
        ) : (
          <div className={Style.NoMatches}>{t('noMatches')}</div>
        )}
      </div>
    </div>
  );
};

export default CategoryOfBusiness;
