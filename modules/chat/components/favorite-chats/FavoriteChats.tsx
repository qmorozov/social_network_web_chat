import { FC, useState, MouseEvent } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useService } from '../../../../hooks/useService';
import { ChatServiceProvider } from '../../chat.service';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../hooks/useActions';
import { ChatsSlice } from '../../stores/chat-list.store';
import { ChatApi } from '../../chat.api';
import { ChatItem } from '../../models/ChatItem';
import ChatAvatar from '../../../../component/avatar/ChatAvatar';
import Modal from '../../../../component/modal/Modal';
import Icon from '../../../../component/icon/Icon';

import Style from '../../../../styles/page/Messages.module.scss';
import { useRouter } from 'next/router';

interface IFavoriteChatItem {
  item: ChatItem;
}

enum optionsConfig {
  delete = 'delete',
  pin = 'pin',
  unpin = 'unpin'
}

const FavoriteChats = () => {
  const { t } = useTranslation();

  // === URL query ===
  const router = useRouter();

  // ==== API Service ====
  const { updateChat } = useActions(ChatsSlice);

  // ==== Global state ====
  const { favoriteChats: list } = useTypedSelector((state) => state.chats);

  const FavoriteChatItem: FC<IFavoriteChatItem> = ({ item }) => {
    const [isContextOpen, setIsContextOpen] = useState(false);

    const bodyOptions = [
      {
        id: optionsConfig.pin,
        render: () => (
          <div className={Style.ChatListItemDropdownItem}>
            <span>
              {t(
                `chatListItemDropdown.${
                  item.isPinned ? optionsConfig.unpin : optionsConfig.pin
                }`
              )}
            </span>
            <Icon id={optionsConfig.pin} />
          </div>
        )
      },
      {
        id: optionsConfig.delete,
        render: () => (
          <div className={Style.ChatListItemDropdownItem}>
            <span>{t(`chatListItemDropdown.${optionsConfig.delete}`)}</span>
            <Icon id={optionsConfig.delete} />
          </div>
        )
      }
    ];

    const pinHandler = async (id: string) => {
      item.isPinned ? await ChatApi.UnpinChat(id) : await ChatApi.PinChat(id);
      updateChat(id);
    };

    const handleChatId = (id: string) => {
      router.push({
        pathname: '/messages',
        query: { id: id }
      });
    };

    return (
      <Modal
        arrow
        open={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        options={bodyOptions}
        onOptionSelect={(idx: string | number) => {
          if (idx === optionsConfig.pin) {
            pinHandler(item.id);
          }
          setIsContextOpen(false);
        }}
      >
        <li
          className={isContextOpen ? Style.OnContextMenuOpen : ''}
          onContextMenu={(event: MouseEvent<HTMLLIElement>) => {
            event.preventDefault();
            setIsContextOpen(true);
          }}
          onClick={() => {
            setIsContextOpen(false);
          }}
        >
          <div onClick={() => handleChatId(item.id)}>
            <ChatAvatar chat={item} size="big" />
            {item?.unreadCount > 0 ? (
              <span className={Style.ChatListItemUnreadBadge}>
                {item?.unreadCount || 1}
              </span>
            ) : null}
          </div>
          <span className={Style.FavoriteChatItemName}>{item.name}</span>
        </li>
      </Modal>
    );
  };

  const FavoriteChatList = () => (
    <div className={Style.FavoriteChatListWrapper}>
      <ul className={Style.FavoriteChatList}>
        {list.map((item: ChatItem, index: number) => (
          <FavoriteChatItem key={`${item.id}_${index}`} item={item} />
        ))}
      </ul>
    </div>
  );

  if (!list?.length) return null;

  return <FavoriteChatList />;
};

export default FavoriteChats;
