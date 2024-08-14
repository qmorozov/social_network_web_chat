import { FC, useState, useEffect } from 'react';
import { ChatItem } from '../../models/ChatItem';
import { formatChatDate, parseMessagePreview } from '../../../helper';
import ChatAvatar from '../../../../component/avatar/ChatAvatar';

import Style from '../../../../styles/page/Messages.module.scss';

interface IChatListItem {
  item: ChatItem;
  active?: boolean;
  onClick: (chatId: string) => any;
}

const ChatListFavorites: FC<IChatListItem> = ({
  item,
  active = false,
  onClick
}) => {
  const [messagePreview, setMessagePreview] = useState('');

  useEffect(() => {
    setMessagePreview(parseMessagePreview(item.lastMessageContent));
  }, [item]);

  const ChatItem = () => (
    <li
      onClick={() => onClick(item.id)}
      className={[
        Style.ChatListItem,
        active ? Style.ChatListItemActive : '',
        item.unreadCount > 0 ? Style.ChatListItemUnread : ''
      ].join(' ')}
    >
      <div className={Style.ChatListItemAvatar}>
        <ChatAvatar chat={item} />
      </div>
      <div className={Style.ChatListItemInfo}>
        <div className={`trim-text ${Style.ChatListItemName}`}>
          <span>Favorites</span>
        </div>
        <div className={Style.ChatListItemPreview}>
          <span className="trim-text">
            {typeof messagePreview === 'object' ? '' : messagePreview}
          </span>
        </div>
      </div>

      <div className={Style.ChatListItemBadges}>
        <span className={Style.ChatListItemDate}>{formatChatDate(item)}</span>
      </div>
    </li>
  );

  return <ChatItem />;
};

export default ChatListFavorites;
