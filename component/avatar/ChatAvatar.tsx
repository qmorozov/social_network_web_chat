import { FC } from 'react';
import Avatar from './Avatar';
import Style from './Avatar.module.scss';
import { ChatItem } from '../../modules/chat/models/ChatItem';
import GroupAvatar from './GroupAvatar';
import { ProfileType } from '../../modules/chat/models/Sender';

interface IChatAvatar {
  chat: ChatItem;
  size?: 'big' | 'small' | null;
}

const AvatarStyle = {
  big: Style.ChatAvatarBig,
  small: Style.ChatAvatarSmall
};

const ChatAvatar: FC<IChatAvatar> = ({ chat, size }) => {
  const avatarOptions = {
    url: chat.photoFileName,
    showOnlineStatus: true,
    background: chat.avatarFillColor,
    isOnline: false,
    name: chat.name,
    type: chat.partnerType
  };

  return (
    <div className={`${Style.ChatAvatar} ${size ? AvatarStyle[size] : ''}`}>
      {chat.partnerId ? (
        <Avatar
          options={avatarOptions}
          onlineIndicatorFor={chat?.partnerVisitorId}
        />
      ) : (
        <GroupAvatar chat={chat} size={size} />
      )}
    </div>
  );
};

export default ChatAvatar;
