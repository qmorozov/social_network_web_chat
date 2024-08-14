import { FC, useEffect, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ChatixService } from '../../../chatix/chatix.service';
import { useTranslation } from 'react-i18next';
import ChatAvatar from '../../../../component/avatar/ChatAvatar';
import PageTitle from '../../../../component/page-title/PageTitle';
import ChatStatus from './ChatStatus';

import Style from '../../styles/chat.module.scss';

const ChatHeader: FC = () => {
  const { t } = useTranslation();

  const [isOnline, setIsOnline] = useState(false);

  const activeChat = useTypedSelector((state) => state.activeChat);
  const { user: userState } = useTypedSelector((state) => state.user);

  const user = activeChat?.info?.name;
  const isGroupChat = activeChat?.info?.type === 1;

  useEffect(() => {
    if (activeChat.info?.partnerVisitorId) {
      ChatixService.isOnline(activeChat.info?.partnerVisitorId).then((s) =>
        setIsOnline(!!s)
      );
    }
  }, []);

  return (
    <PageTitle
      classes={Style.chatHeader}
      title={
        <div className={Style.ChatHeaderUserInfo}>
          <div className={Style.ChatHeaderAvatar}>
            <ChatAvatar size={'small'} chat={activeChat?.info!}></ChatAvatar>
          </div>
          <div>
            <h2
              className={`${Style.ChatHeaderTitle} trim-text`}
              title={activeChat.info?.name || user}
            >
              {userState!.id === activeChat.info?.partnerId
                ? t('favorites.title')
                : activeChat.info?.name}
            </h2>
            <ChatStatus
              isGroupChat={isGroupChat}
              members={activeChat?.members?.length}
              isOnline={isOnline}
            />
          </div>
        </div>
      }
    >
      <div className={Style.MenuIcon}>{/* <ChatMenuDropdown /> */}</div>
    </PageTitle>
  );
};

export default ChatHeader;
