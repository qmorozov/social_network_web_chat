import React from 'react';
import Icon from '../../../../component/icon/Icon';
import { TextHighlight } from '../../../../component/text-highlight/TextHighlight';
import { ISearchItem } from '../MapSearchInput';
import Style from '../MapSearchInput.module.scss';

const MapSearchCategory = ({ item, searchInput }: ISearchItem) => {
  return (
    <>
      <div className={Style.SearchResultIcon}>
        <Icon id="map-mark" />
      </div>
      <div className={Style.SearchSuggestionLabelWrapper}>
        <div className={Style.SearchSuggestionLabel}>
          {TextHighlight(item.content || '', searchInput)}
        </div>
        <div className={Style.SearchSuggestionSubLabel}></div>
      </div>
      {/*<div className={Style.SearchResultActions}>*/}
      {/*  <button>*/}
      {/*    <Icon id="close" />*/}
      {/*  </button>*/}
      {/*</div>*/}
    </>
  );
};

export default MapSearchCategory;
