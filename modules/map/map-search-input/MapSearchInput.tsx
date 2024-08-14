import Style from './MapSearchInput.module.scss';
import { useEffect, useRef, useState } from 'react';
import Icon from '../../../component/icon/Icon';
import MapSearchQuery from './MapSearchTypes/MapSearchQuery';
import MapSearchBusinessAccount from './MapSearchTypes/MapSearchBusinessAccount';
import MapSearchCategory from './MapSearchTypes/MapSearchCategory';
import { useRouter } from 'next/router';
import { Route, route } from '../../../config/route';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { MapSlice } from '../store/map';
import { BusinessApi } from '../../company/company.api';
import { useService } from '../../../hooks/useService';
import { MapProvider } from '../services/map.service';

enum SearchResultTypes {
  query = 'QUERY',
  categoryGroup = 'CATEGORY_GROUP',
  category = 'CATEGORY',
  businessAccount = 'BUSINESS_ACCOUNT'
}

export type SearchItem = {
  content: string;
  businessAccount?: {
    id: string;
    name: string;
    avatarFillColor: string | undefined;
    photoFileName: string | undefined;
  };
  type: string;
  categoryId: string | null;
  categoryGroupId: string | null;
};

export interface ISearchItem {
  item: SearchItem;
  searchInput: string;
}

interface IMapSearchInput {
  setQuery: (str: string) => void;
}

export default function MapSearchInput({ setQuery }: IMapSearchInput) {
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [onFocus, setOnFocus] = useState(false);
  const router = useRouter();
  const [searchResult, setSearchResult] = useState<Array<any>>([]);

  const { searchInput, selectedCategoryGroupId, selectedCategoryId } =
    useTypedSelector((state) => state.map);
  const { signed } = useTypedSelector((state) => state.user);
  const { setSearchInput, setCategoryGroupId, setCategoryId } =
    useActions(MapSlice);

  const { getSearchHistory } = useService(MapProvider);

  const { searchHistory, isHistoryLoaded } = useTypedSelector(
    (state) => state.map
  );

  useEffect(() => {
    if (onFocus && !isHistoryLoaded && signed) {
      getSearchHistory();
    }
  }, [onFocus]);

  useEffect(() => {
    async function getSearchResult() {
      await BusinessApi.GetInputSearchResult({
        query: searchInput
      }).then((res) => setSearchResult(res));
    }
    if (searchInput.length) {
      getSearchResult();
    }
  }, [searchInput]);

  const onBlurHandler = (event: any, searchItem: any = null) => {
    if (!ref.current || ref.current.contains(event.target)) {
      if (searchItem) {
        onClickHandler(searchItem);
        setOnFocus(false);
      }
      return;
    }
    setOnFocus(false);
  };

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

  useEffect(() => {
    const searchInputRef = inputRef.current;

    function onFocus() {
      setOnFocus(true);
    }

    searchInputRef?.addEventListener('focus', onFocus);
    document.addEventListener('click', onBlurHandler);

    return () => {
      searchInputRef?.removeEventListener('focus', onFocus);
      document.removeEventListener('click', onBlurHandler);
    };
  }, []);

  const inputHandler = (str: string) => {
    setSearchInput(str);
  };

  const onClickHandler = (c: SearchItem) => {
    switch (c.type) {
      case SearchResultTypes.query:
        setSearchInput(c.content);
        setQuery(c.content);
        break;
      case SearchResultTypes.businessAccount:
        c.businessAccount &&
          router.push(`${route(Route.company).link()}/${c.businessAccount.id}`);
        break;
      case SearchResultTypes.category:
        c.categoryId && categorySelectHandler(c.categoryId);
        break;
      case SearchResultTypes.categoryGroup:
        c.categoryGroupId && categoryGroupSelectHandler(c.categoryGroupId);
        break;
    }
  };

  const getInputResultType = (type: string, item: SearchItem) => {
    switch (type) {
      case SearchResultTypes.query:
        return <MapSearchQuery item={item} searchInput={searchInput} />;
      case SearchResultTypes.businessAccount:
        return (
          <MapSearchBusinessAccount item={item} searchInput={searchInput} />
        );
      case SearchResultTypes.category:
        return <MapSearchCategory item={item} searchInput={searchInput} />;
      case SearchResultTypes.categoryGroup:
        return <MapSearchCategory item={item} searchInput={searchInput} />;
    }
  };

  return (
    <div className={Style.SearchBox} ref={ref}>
      <div className={Style.SearchInputWrapper}>
        <button
          className={Style.SearchIcon}
          onClick={() => {
            setQuery(searchInput);
          }}
        >
          <Icon id="search" width={14} height={15} />
        </button>
        <input
          type="search"
          ref={inputRef}
          onChange={(e) => inputHandler(e.target.value)}
          value={searchInput}
          placeholder="Company, category, zip or adress"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setQuery(searchInput);
            }
          }}
        />
        {searchInput.length ? (
          <button
            className={Style.CloseIcon}
            onClick={() => {
              setSearchInput('');
              setQuery('');
            }}
          >
            <Icon id="close" width={8} height={8} />
          </button>
        ) : null}
      </div>

      {onFocus && !searchInput.length && searchHistory.length ? (
        <div className={Style.SearchInputDropdown}>
          <div className={Style.SearchInputDropdownLabel}>Recent:</div>
          <ul className={Style.SearchSuggestions}>
            {searchHistory.map((history, idx) => (
              <li
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchInput(history.query);
                  setQuery(history.query);
                }}
              >
                <div className={Style.SearchResultIcon}>
                  <Icon id="search" width={14} height={15} />
                </div>
                <div>
                  <div className={Style.SearchSuggestionLabel}>
                    {history.query}
                  </div>
                  <div className={Style.SearchSuggestionSubLabel}></div>
                </div>
                {/*<div className={Style.SearchResultActions}>*/}
                {/*  <button>*/}
                {/*    <Icon id="close" width={6} height={6} />*/}
                {/*  </button>*/}
                {/*</div>*/}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {onFocus && searchInput.length && !!searchResult?.length ? (
        <div className={Style.SearchInputDropdown}>
          <ul className={Style.SearchSuggestions}>
            {searchResult.map((c, idx) => (
              <li
                onClick={(e) => {
                  onBlurHandler(e, c);
                }}
                key={idx}
              >
                {getInputResultType(c.type, c)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
