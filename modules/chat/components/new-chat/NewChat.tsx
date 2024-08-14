import { Switch } from '@headlessui/react';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';
import { useAppDispatch } from '../../../../services/app-store';
import { CreateChatSlice } from '../../stores/create-chat.store';
import BackBtn from '../back-btn/BackBtn';
import Style from './NewChat.module.scss';

interface INewChat {
  closeAddChat: () => void;
  openAddGroup: () => void;
}

const NewChat: FC<INewChat> = ({ closeAddChat, openAddGroup }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState<any>();

  const swichRef = useRef<any>(null);

  const onClick = () => {
    swichRef.current.click();
  };

  const [selected, setSelected] = useState([]);

  const handleChange = (checked: boolean, value: string) => {
    setEnabled({ ...enabled, [value]: checked });

    setSelected((prev: any) =>
      checked ? [...prev, value] : prev.filter((val: string) => val !== value)
    );
  };

  const selectMembers = () => {
    dispatch(CreateChatSlice.actions.setMemberIds(selected));
    openAddGroup();
  };

  const addNewGroup = () => {
    selectMembers();
    dispatch(CreateChatSlice.actions.setFeedChat(false));
  };

  const addNewChannel = () => {
    selectMembers();
    dispatch(CreateChatSlice.actions.setFeedChat(true));
  };

  // Test
  const testId = '9f2d9974-c606-4b01-aa40-7f923f1a1663';

  return (
    <div className={Style.NewChat}>
      <fieldset className={Style.NewChatHeader}>
        <div>
          <BackBtn onClick={closeAddChat} />
          <span>{t('create-chat.new-chat.title')}</span>
        </div>
        <Button icon>
          <Icon id="search" />
        </Button>
      </fieldset>
      <div className={Style.NewChatItem} onClick={addNewGroup}>
        <div className={Style.NewChatInfo}>
          <Icon id="new-group" />
          <div className={Style.TitleAndSubTitle}>
            <h2>{t('create-chat.new-chat.new-group.title')}</h2>
            <h3>{t('create-chat.new-chat.new-group.subtitle')}</h3>
          </div>
        </div>
        <Icon id="plus-" />
      </div>
      <div className={Style.NewChatItem} onClick={addNewChannel}>
        <div className={Style.NewChatInfo}>
          <Icon id="new-channel" />
          <div className={Style.TitleAndSubTitle}>
            <h2>{t('create-chat.new-chat.new-channel.title')}</h2>
            <h3>{t('create-chat.new-chat.new-channel.subtitle')}</h3>
          </div>
        </div>
        <Icon id="plus-" />
      </div>

      <div className={Style.Contacts}>
        <h2>Contacts:</h2>
        <div className={Style.NewChatItem} onClick={onClick}>
          <div className={Style.NewChatInfo}>
            <Icon id="person" />
            <div className={Style.TitleAndSubTitle}>
              <h2>Nick Jonas</h2>
              <h3>+380 (50) 225 88 05</h3>
            </div>
          </div>
          <Switch
            ref={swichRef}
            checked={enabled?.[testId] || false}
            onChange={(checked) => handleChange(checked, testId)}
            className={Style.SwitchUser}
            onClick={(e: any) => e.stopPropagation()}
          >
            {enabled?.[testId] && <span />}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
