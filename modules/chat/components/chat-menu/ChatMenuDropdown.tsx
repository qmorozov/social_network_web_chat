import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuDots from '../../../../component/menu-dots/MenuDots';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import Style from './ChatMenuDropdown.module.scss';

enum ChatMenuDropdownConfig {
  shareChat = 'shareChat',
  inviteFriends = 'inviteFriends',
  muteNotifications = 'muteNotifications',
  clearMessages = 'clearMessages'
}

const ChatMenuDropdown: FC = () => {
  const { t } = useTranslation();

  const options = [
    {
      id: ChatMenuDropdownConfig.shareChat,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('chatMenu.shareChat')}
          <Icon id="share" />
        </div>
      ),
      url: '/'
    },
    {
      id: ChatMenuDropdownConfig.inviteFriends,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('chatMenu.inviteUsers')}
          <Icon id="invite-friends" />
        </div>
      ),
      url: '/'
    },
    {
      id: ChatMenuDropdownConfig.muteNotifications,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('chatMenu.muteNotifications')}
          <Icon id="mute" />
        </div>
      ),
      url: '/'
    },
    {
      id: ChatMenuDropdownConfig.clearMessages,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('chatMenu.clearMessages')}
          <Icon id="delete-text" />
        </div>
      ),
      url: '/'
    }
  ];

  const onOptionSelectHandler = (id: number | string) => {
    console.log(id);
  };
  const [isContextOpen, setIsContextOpen] = useState(false);

  return (
    <Modal
      position="bottom-end"
      open={isContextOpen}
      onClose={() => setIsContextOpen(false)}
      options={options}
      classNameModalBody={Style.ModalBody}
      onOptionSelect={(idx) => {
        onOptionSelectHandler(idx);
        setIsContextOpen(false);
      }}
    >
      <div onClick={() => setIsContextOpen(true)}>
        <MenuDots />
      </div>
    </Modal>
  );
};

export default ChatMenuDropdown;
