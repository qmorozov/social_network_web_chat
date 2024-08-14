import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useService } from '../../../../hooks/useService';
import { ChatServiceProvider } from '../../chat.service';
import { useTranslation } from 'react-i18next';
import { ChatItem } from '../../models/ChatItem';
import { ChatApi } from '../../chat.api';
import { useActions } from '../../../../hooks/useActions';
import { ChatsSlice } from '../../stores/chat-list.store';
import InfiniteScroll from 'react-infinite-scroll-component';
import Icon from '../../../../component/icon/Icon';
import ChatListItem from './ChatListItem';
import ChatListFavorites from './ChatListFavorites';
import Loader from '../../../../component/loader/Loader';

import Style from '../../../../styles/page/Messages.module.scss';
import { ChatixService } from '../../../chatix/chatix.service';
import { useRouter } from 'next/router';

interface IChatList {
  setMember: (member: null) => void;
  sortedChats: Array<ChatItem>;
}

enum ChatsOptions {
  pin = 'pin',
  delete = 'delete'
}

const ChatList: FC<IChatList> = ({ setMember, sortedChats }) => {
  const { t } = useTranslation();

  // === URL query ===
  const router = useRouter();
  const { id } = router.query;
  const urlChatId: string | undefined = typeof id === 'string' ? id : id?.[0];

  // ==== API Service ====
  const ChatService = useService(ChatServiceProvider);
  const { updateChat, updateChatList } = useActions(ChatsSlice);

  // ==== Global state ====
  const activeChat = useTypedSelector((state) => state.activeChat);
  const { user, selectedCompany } = useTypedSelector((state) => state.user);
  const { chats, hasMore, date, takeBefore, loading } = useTypedSelector(
    (state) => state.chats
  );

  // ==== Local state ====
  const [isSelectOption, setIsSelectOptions] = useState(false);
  const [selectedChats, setSelectedChats] = useState<ChatItem[]>([]);

  const isSelected = useMemo(() => {
    return (id: string) => {
      return !!selectedChats.find((chat: ChatItem) => chat?.id === id);
    };
  }, [selectedChats]);

  // ==== Bottom chat list options ====
  const bottomMenuOptions = [
    {
      id: ChatsOptions.delete,
      title: t(`chatListItemDropdown.${ChatsOptions.delete}`),
      icon: <Icon id={ChatsOptions.delete} />
    },
    {
      id: ChatsOptions.pin,
      title: t(`chatListItemDropdown.${ChatsOptions.pin}`),
      icon: <Icon id={ChatsOptions.pin} />
    }
  ];

  useEffect(() => {
    if (selectedChats.length === 0) {
      setIsSelectOptions(false);
    }
  }, [selectedChats]);

  const handleBottomOptions = useCallback(
    async (id: ChatsOptions) => {
      if (id === ChatsOptions.delete) {
        selectedChats.map(async (item: ChatItem) => {
          await ChatixService.deleteMessagesForUser(item.lastMessageId);
        });

        const updatedChats = chats.filter(
          (chat: ChatItem) => !selectedChats.some((item) => item.id === chat.id)
        );
        updateChatList(updatedChats);

        setSelectedChats([]);
        setIsSelectOptions(false);
      } else if (id === ChatsOptions.pin) {
        await Promise.all(
          selectedChats.map(async (chat: ChatItem) => {
            await (chat.isPinned
              ? ChatApi.UnpinChat(chat.id)
              : ChatApi.PinChat(chat.id));

            await updateChat(chat.id);
          })
        );

        setSelectedChats([]);
        setIsSelectOptions(false);
      }
    },
    [selectedChats, updateChat]
  );

  useEffect(() => {
    updateChatList;
    updateChat;
  }, [activeChat.messages]);

  const handleChatId = (id: string) => {
    router.push({
      pathname: '/messages',
      query: { id: id }
    });
  };

  return (
    <InfiniteScroll
      hasMore={hasMore}
      dataLength={chats.length}
      scrollableTarget="chat-list"
      style={{ overflow: 'initial' }}
      loader={<Loader classes={Style.Loader} relative={true} />}
      next={() => ChatService.getList(selectedCompany!, date, takeBefore)}
    >
      {sortedChats.length ? (
        <ul className={Style.ChatList}>
          {sortedChats
            .filter((chat: ChatItem) => user!.id === chat.partnerId)
            .map((chat: ChatItem) => (
              <ChatListFavorites
                key={chat.id}
                item={chat}
                onClick={() => {
                  setMember(null);
                  handleChatId(chat.id);
                }}
                active={chat.id === activeChat?.id}
              />
            ))}

          {sortedChats.map((chat: ChatItem) => {
            if (!chat.isPinned && !(user!.id === chat.partnerId)) {
              return (
                <ChatListItem
                  item={chat}
                  key={chat.id}
                  isSelectOption={isSelectOption}
                  setIsSelectOptions={(state: boolean) =>
                    setIsSelectOptions(state)
                  }
                  isSelected={isSelected(chat.id)}
                  onSelect={() => {
                    setMember(null);
                    handleChatId(chat.id);
                  }}
                  active={chat.id === activeChat!.id}
                  setSelectedChats={setSelectedChats}
                />
              );
            }
          })}
        </ul>
      ) : loading ? (
        <Loader />
      ) : null}

      {selectedChats.length > 0 && (
        <div className={Style.OnSelectMenu}>
          {bottomMenuOptions.map(({ id, title, icon }) => (
            <button onClick={() => handleBottomOptions(id)} key={id}>
              {icon}
              <span>{title}</span>
            </button>
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
};

export default ChatList;
