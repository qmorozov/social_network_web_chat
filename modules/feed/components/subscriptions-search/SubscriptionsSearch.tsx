import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MessagesSearchInput from '../../../chat/components/messages-search-input/MessagesSearchInput';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';
import { useDropDown } from '../../../../hooks/useDropDown';

import Style from './SubscriptionsSearch.module.scss';

interface ISubscriptionsSearch {
  searchResult: (x: string) => void;
}

const SubscriptionsSearch: FC<ISubscriptionsSearch> = ({ searchResult }) => {
  const { t } = useTranslation();
  const { opened, open, close } = useDropDown();

  const searchClick = () => {
    open();
  };

  const backClick = () => {
    close();
  };

  const onSubmit = (e: any) => {
    console.log(e);
  };

  return (
    <div className={Style.SearchBlock}>
      {opened ? (
        <div className={Style.WrapperContent}>
          <MessagesSearchInput close={backClick} searchResult={searchResult} />
        </div>
      ) : (
        <div className={Style.Action}>
          <Button icon onClick={searchClick}>
            <Icon id="search" />
          </Button>
          <div className={Style.Title}>{t('feed.subscriptions-title')}</div>
          <div />
        </div>
      )}
    </div>
  );
};

export default SubscriptionsSearch;
