import { FC, SetStateAction, useState, useEffect, MouseEvent } from 'react';
import { ChatItem } from '../../models/ChatItem';
import { useTranslation } from 'react-i18next';
import ChatAvatar from '../../../../component/avatar/ChatAvatar';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import Style from '../../../../styles/page/Messages.module.scss';
import { ChatApi } from '../../chat.api';
import { useActions } from '../../../../hooks/useActions';
import { ChatsSlice } from '../../stores/chat-list.store';
import { ChatixService } from '../../../chatix/chatix.service';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { formatChatDate, parseMessagePreview } from '../../../helper';
import { useDropDown } from '../../../../hooks/useDropDown';

interface IChatListItem {
  item: ChatItem;
  active?: boolean;
  onSelect?: (chatId: string) => any;
  isSelectOption: boolean;
  setIsSelectOptions: (state: boolean) => void;
  isSelected: boolean;
  setSelectedChats: SetStateAction<any>;
}

enum contextOptions {
  select = 'select',
  delete = 'delete',
  pin = 'pin',
  unpin = 'unpin'
}

const ChatListItem: FC<IChatListItem> = ({
  item,
  active = false,
  onSelect,
  isSelectOption,
  setIsSelectOptions,
  isSelected,
  setSelectedChats
}) => {
  const { t } = useTranslation();

  // ==== API Service ====
  const { updateChat, updateChatList } = useActions(ChatsSlice);

  // ==== Global state ====
  const { chats } = useTypedSelector((state) => state.chats);

  // ==== Local state ====
  const [messagePreview, setMessagePreview] = useState('');
  const [isContextOpen, setIsContextOpen] = useState(false);

  useEffect(() => {
    setMessagePreview(parseMessagePreview(item.lastMessageContent));
  }, [item]);

  const ChatItem = () => (
    <li
      onContextMenu={(event: MouseEvent) => {
        event.preventDefault();
        setIsContextOpen(true);
      }}
      onClick={() => {
        setIsContextOpen(false);
        isSelectOption
          ? selectHandler(item.id, item.lastMessageId)
          : onSelect?.(item.id);
      }}
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
          <span>{item.name}</span>
        </div>
        <div className={Style.ChatListItemPreview}>
          <span className="trim-text">{t(messagePreview)}</span>
        </div>
      </div>
      {isSelectOption ? (
        <div className={Style.ChatItemSelect}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => selectHandler(item.id, item.lastMessageId)}
          />
        </div>
      ) : (
        <div className={Style.ChatListItemBadges}>
          <div className={Style.ChatListItemDate}>{formatChatDate(item)}</div>
          <div>
            {item?.unreadCount > 0 ? (
              <span className={Style.ChatListItemUnreadBadge}>
                {item?.unreadCount || 1}
              </span>
            ) : (
              <span>
                {item.lastMessageStatus === 0 && <Icon id="msg-sent" />}
                {item.lastMessageStatus === 1 && <Icon id="msg-delivered" />}
                {item.lastMessageStatus === 2 && <Icon id="msg-read" />}
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  );

  const contextOptionsData = [
    {
      id: contextOptions.select,
      render: () => (
        <div className={Style.ChatListItemDropdownItem}>
          <span>{t(`chatListItemDropdown.${contextOptions.select}`)}</span>
          <Icon id={contextOptions.select} />
        </div>
      )
    },
    {
      id: contextOptions.delete,
      render: () => (
        <div className={Style.ChatListItemDropdownItem}>
          <span>{t(`chatListItemDropdown.${contextOptions.delete}`)}</span>
          <Icon id={contextOptions.delete} />
        </div>
      )
    },
    {
      id: contextOptions.pin,
      render: () => (
        <div className={Style.ChatListItemDropdownItem}>
          <span>{t(`chatListItemDropdown.${contextOptions.pin}`)}</span>
          <Icon id={contextOptions.pin} />
        </div>
      )
    }
  ];

  const selectHandler = (id: string, lastMessageId: string) => {
    if (!isSelectOption) {
      setIsSelectOptions(true);
    }
    if (!isSelected) {
      const chat = { id, lastMessageId };
      setSelectedChats((prev: Array<ChatItem>) => [...prev, chat]);
    } else {
      setSelectedChats((prev: Array<ChatItem>) =>
        prev.filter((chat) => chat.id !== id)
      );
    }
  };

  const { opened, open, close } = useDropDown();

  const handleContextOptions = async (id: string | number) => {
    switch (id) {
      case contextOptions.select:
        selectHandler(item.id, item.lastMessageId);
        break;
      case contextOptions.pin:
        await (item.isPinned
          ? ChatApi.UnpinChat(item.id)
          : ChatApi.PinChat(item.id));
        close();
        updateChat(item.id);
        break;
      case contextOptions.delete:
        if (item.lastMessageId) {
          await ChatixService.deleteMessagesForUser(item.lastMessageId);
          close();
          updateChatList(chats.filter((chat: ChatItem) => chat.id !== item.id));
        }
        break;
      default:
        break;
    }
    setIsContextOpen(false);
  };

  return (
    <Modal
      arrow
      open={isContextOpen}
      onClose={() => setIsContextOpen(false)}
      options={contextOptionsData}
      onOptionSelect={(id) => handleContextOptions(id)}
    >
      <div
        onContextMenu={() => setIsContextOpen(true)}
        className={isContextOpen ? Style.OnContextMenuOpen : ''}
      >
        <ChatItem />
      </div>
    </Modal>
  );
};

export default ChatListItem;
