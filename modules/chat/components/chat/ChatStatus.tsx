import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Style from '../../styles/chat.module.scss';

interface IChatStatus {
  isGroupChat?: boolean;
  isOnline?: boolean;
  members?: number;
}

const ChatStatus: FC<IChatStatus> = ({
  isGroupChat,
  isOnline,
  members = 0
}) => {
  const { t } = useTranslation();

  return (
    <>
      {isGroupChat ? (
        <h2 className={Style.ChatHeaderSubTitle}>
          {t('chat.status.members')} {members}
        </h2>
      ) : (
        <h2 className={Style.ChatHeaderSubTitle}>
          {isOnline
            ? t('chat.status.online')
            : t('chat.status.lastSeenRecently')}
        </h2>
      )}
    </>
  );
};

export default ChatStatus;
