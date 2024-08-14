import React from 'react';
import Avatar from '../../../../component/avatar/Avatar';
import Icon from '../../../../component/icon/Icon';
import { TextHighlight } from '../../../../component/text-highlight/TextHighlight';
import { ProfileType } from '../../../chat/models/Sender';
import { ISearchItem } from '../MapSearchInput';
import Style from '../MapSearchInput.module.scss';

const MapSearchBusinessAccount = ({ item, searchInput }: ISearchItem) => {
  const avatarOptions = {
    url: item?.businessAccount?.photoFileName,
    showOnlineStatus: false,
    background: item?.businessAccount?.avatarFillColor,
    name: item?.businessAccount?.name,
    type: ProfileType.business
  };

  return (
    <>
      <div className={Style.SearchResultIcon}>
        <Avatar options={avatarOptions} />
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

export default MapSearchBusinessAccount;
