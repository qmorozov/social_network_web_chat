import { createContext, FC, useEffect } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useService } from '../../../../hooks/useService';
import { ChatServiceProvider } from '../../chat.service';
import InfiniteScroll from 'react-infinite-scroll-component';
import Style from '../../styles/chat.module.scss';
import ChatMessagesContainer from './ChatMessagesContainer';

interface ContextInterface {
  isGroupChat: boolean;
}

export const GroupChat = createContext<ContextInterface | null>(null);

const ChatMessageList: FC = () => {
  const ChatService = useService(ChatServiceProvider);
  const activeChat = useTypedSelector((state) => state.activeChat);
  const isGroupChat = !activeChat.info?.partnerType;

  useEffect(() => {
    if (activeChat?.info?.chatixChatroomId && !activeChat.messages) {
      ChatService.loadChatHistory(activeChat.info.chatixChatroomId).then(() => {
        ChatService.scrollChatToEnd();
      });
    }
  }, [activeChat.info]);

  return (
    <div className={`${Style.ChatMessages} page-content-size`}>
      <InfiniteScroll
        next={() => console.log('todo load older')}
        hasMore={activeChat?.hasMore}
        loader={null}
        scrollableTarget="chat-list"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          overflow: 'inherit',
          paddingTop: '5px'
        }}
        dataLength={activeChat.messages?.length || 0}
      >
        <GroupChat.Provider value={{ isGroupChat }}>
          {(activeChat?.messagesByDate || []).map(({ date, messages }) => {
            return (
              <ChatMessagesContainer
                date={date}
                messages={messages}
                key={date}
              />
            );
          })}
        </GroupChat.Provider>
      </InfiniteScroll>
    </div>
  );
};

export default ChatMessageList;
