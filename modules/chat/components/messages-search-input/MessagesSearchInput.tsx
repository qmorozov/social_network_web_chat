import { FC, useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';
import Button from '../../../../component/button/Button';

import Style from './MessagesSearchInput.module.scss';

interface Props {
  close: () => void;
  searchResult: (value: string) => void;
}

const MessagesSearchInput: FC<Props> = ({ close, searchResult }) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    searchResult(searchValue);
  }, [searchValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
    >
      <fieldset className={Style.SearchInputWrapper}>
        <Button icon onClick={close}>
          <Icon id="a-back" width={14} height={14} />
        </Button>
        <input
          autoFocus={true}
          value={searchValue}
          onChange={handleChange}
          placeholder={t('chat.search-chat-placeholder')}
        />
        {searchValue ? (
          <Button onClick={() => setSearchValue('')} icon title="Clear input">
            <Icon id="delete-text" width={18} height={16} />
          </Button>
        ) : (
          <Button icon title="Search">
            <Icon id="search" width={16} height={16} />
          </Button>
        )}
      </fieldset>
    </form>
  );
};

export default MessagesSearchInput;
