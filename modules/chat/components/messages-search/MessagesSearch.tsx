import { FC } from 'react';
import { useDropDown } from '../../../../hooks/useDropDown';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';
import MessagesSearchInput from '../messages-search-input/MessagesSearchInput';

import Style from './MessagesSearch.module.scss';

interface IMessagesSearchProps {
  searchResult: (searchValue: string) => void;
}

const MessagesSearch: FC<IMessagesSearchProps> = ({ searchResult }) => {
  const { opened, open, close } = useDropDown();

  return (
    <div className={Style.SearchBlock}>
      {opened ? (
        <div className={Style.WrapperContent}>
          <MessagesSearchInput close={close} searchResult={searchResult} />
        </div>
      ) : (
        <div className={Style.Action}>
          <Button icon onClick={open}>
            <Icon id="search" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessagesSearch;
