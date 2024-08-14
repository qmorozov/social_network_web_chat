import React, { FC, useEffect, useState, useTransition } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ChatServiceProvider } from '../../chat.service';
import { useService } from '../../../../hooks/useService';
import { Sender } from '../../models/Sender';
import { getTime } from 'date-fns';
import { ChatItem } from '../../models/ChatItem';
import AppSide from '../../../../component/app-side/AppSide';
import AppContent from '../../../../component/app-content/AppContent';
import MessagesSearch from '../messages-search/MessagesSearch';
import FavoriteChats from '../favorite-chats/FavoriteChats';
import ChatList from '../chat-list/ChatList';
import Chat from '../chat/Chat';
import ChatInfo from '../chat-info/ChatInfo';
import ChatMembersList from '../chat-members-list/ChatMembersList';
import EmptyChat from '../empty-chat/EmptyChat';
import Loader from '../../../../component/loader/Loader';
import { useRouter } from 'next/router';
import Empty from '../empty-chat/EmptyChat.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../../../../component/button/Button';
import { Route, route } from '../../../../config/route';

const MessagesPageContent: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  // === URL query ===
  const { id } = router.query;
  const urlChatId: string | undefined = typeof id === 'string' ? id : id?.[0];

  // ==== API Service ====
  const ChatService = useService(ChatServiceProvider);

  // ==== Global state ====
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const { chats } = useTypedSelector((state) => state.chats);
  const activeChat = useTypedSelector((state) => state.activeChat);

  // ==== Local state ====
  const [isPending, startTransition] = useTransition();
  const [member, setMember] = useState<Sender | null>(null);
  const [searchResult, setSearchResult] = useState('');
  const [sortedChats, setSortedChats] = useState<any>([]);
  const [searchFilteredChats, setSearchFilteredChats] = useState<any>([]);
  const [chatsFetched, setChatsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allChatsLoaded, setAllChatsLoaded] = useState(false);

  const getChatList = async (date?: string, takeBefore?: boolean) => {
    console.log('getChatList');

    if (date !== '') {
      await ChatService.getList(selectedCompanyId!, date, takeBefore);
    } else {
      await ChatService.getList(selectedCompanyId!);
    }

    setLoading(false);
    setAllChatsLoaded(true);
  };

  useEffect(() => {
    ChatService.clearActiveChat();
  }, []);

  useEffect(() => {
    if (!chatsFetched) {
      getChatList();
      setChatsFetched(true);
    }
  }, [selectedCompanyId, chatsFetched]);

  useEffect(() => {
    return setSortedChats(
      [...chats]
        .filter(({ lastMessageContent }) => lastMessageContent != null)
        .sort((a: ChatItem, b: ChatItem) => {
          return (
            getTime(new Date(b.lastMessageSentAt)) -
            getTime(new Date(a.lastMessageSentAt))
          );
        })
    );
  }, [chats]);

  useEffect(() => {
    startTransition(() => {
      if (sortedChats && searchResult) {
        setSearchFilteredChats(
          sortedChats.filter((chat: any) => {
            if (chat.name) {
              return chat.name
                .toLowerCase()
                .includes(searchResult.toLowerCase().trim());
            } else if (chat.partner.name) {
              return chat.partner.name
                .toLowerCase()
                .includes(searchResult.toLowerCase().trim());
            }
          })
        );
      } else {
        setSearchFilteredChats([]);
      }
    });
  }, [searchResult]);

  useEffect(() => {
    if (allChatsLoaded && urlChatId) {
      ChatService.setActiveChat(urlChatId);
    }
  }, [allChatsLoaded, urlChatId]);

  const onMemberSelect = (id: string) => {
    const member =
      activeChat.members?.find((member) => member.id === id) || null;
    setMember(member);
  };

  useEffect(() => {
    const chatExists = chats.some((chat) => chat.id === urlChatId);
    if (!chatExists && urlChatId) {
      router.replace('/messages');
    }
  }, [chats.length, urlChatId]);

  if (loading) {
    return <Loader />;
  }

  if (!chats.length) {
    return <EmptyChat />;
  }

  return (
    <>
      <AppSide type="left" className="-ls chats" id="chat-list">
        <MessagesSearch searchResult={(event) => setSearchResult(event)} />
        <FavoriteChats />
        {!isPending ? (
          <ChatList
            setMember={setMember}
            sortedChats={
              searchResult.length > 0 ? searchFilteredChats : sortedChats
            }
          />
        ) : (
          <Loader />
        )}
      </AppSide>
      <AppContent padding="wide" id="chat-messages-list">
        {urlChatId ? (
          <Chat getChatList={getChatList} />
        ) : (
          <div className={Empty.wrapper}>
            <h1 className={Empty.title}>
              <Trans>{t('selectAChat')}</Trans>
            </h1>
            <p className={Empty.text}>{t('toStartMessaging')}</p>
            <Button
              classes={Empty.button}
              onClick={() => router.push(`${route(Route.map).link()}`)}
            >
              {t('searchContactOnMap')}
            </Button>
          </div>
        )}
      </AppContent>
      <AppSide type="right" className="chat-aside">
        {urlChatId ? (
          !member && activeChat?.members?.length ? (
            <ChatMembersList
              onMemberSelect={onMemberSelect}
              members={activeChat.members}
              chatId={activeChat.id!}
            />
          ) : (
            <ChatInfo member={member} setMember={setMember} />
          )
        ) : null}
      </AppSide>
    </>
  );
};

export default MessagesPageContent;
