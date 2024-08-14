import { FC, useEffect, useRef } from 'react';
import Style from './Avatar.module.scss';
import { ChatItem } from '../../modules/chat/models/ChatItem';
import { AppData } from '../../services/app';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useService } from '../../hooks/useService';
import { ChatServiceProvider } from '../../modules/chat/chat.service';
import Loader from '../loader/Loader';
import Avatar from './Avatar';

interface IGroupAvatar {
  chat: ChatItem;
  size?: 'big' | 'small' | null;
}

const GroupAvatarStyle = {
  small: Style.GroupAvatarSmall,
  big: Style.GroupAvatar
};

const GroupAvatar: FC<IGroupAvatar> = ({ chat, size }) => {
  const chatInfo = useTypedSelector((state) => state.chatMembers[chat.id]);
  const backgroundImage = useRef(
    AppData.avatarUrlPathStyle(chat.photoFileName)
  );
  const ChatService = useService(ChatServiceProvider);

  function hasBackground() {
    return backgroundImage.current !== 'none';
  }

  useEffect(() => {
    if (!hasBackground() && !chatInfo?.loading && !chatInfo?.members) {
      ChatService.loadChatMembers(chat.id);
    }
  }, [backgroundImage.current]);

  return (
    <ul
      className={`${Style.GroupAvatar} ${size ? GroupAvatarStyle[size] : ''}`}
      style={{
        backgroundImage: backgroundImage.current,
        borderWidth: hasBackground() ? '0' : '1px'
      }}
    >
      {hasBackground() ? null : chatInfo?.loading ? (
        <Loader />
      ) : (
        (chatInfo?.members || []).slice(0, 4).map((m, i) => {
          const avatarOptions = {
            url: m?.photoFileName,
            background: m?.defaultAvatarBackground,
            isOnline: m?.isOnline,
            name: m?.name
          };
          return (
            <li key={`${m.id}-${i}`}>
              <Avatar options={avatarOptions} />
            </li>
          );
        })
      )}
    </ul>
  );
};

export default GroupAvatar;
