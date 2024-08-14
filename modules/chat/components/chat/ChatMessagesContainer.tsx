import React, { FC, useState } from 'react';
import { format } from 'date-fns';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ChatixService } from '../../../chatix/chatix.service';
import { useActions } from '../../../../hooks/useActions';
import ActiveChatReducer, {
  ActiveChatSlice
} from '../../stores/active-chat.store';
import type { Message } from '@chatix/core-ts';
import ChatMessage from '../chat-message';
import Modal from '../../../../component/modal/Modal';
import Icon from '../../../../component/icon/Icon';

import Style from '../../styles/chat.module.scss';
import { useService } from '../../../../hooks/useService';
import { ChatServiceProvider } from '../../chat.service';
import ShareModal from '../../../../component/share-modal/ShareModal';
import { useDropDown } from '../../../../hooks/useDropDown';
import { useRouter } from 'next/router';

interface IChatMessagesContainer {
  date: number;
  messages: any[];
}

enum optionsConfig {
  forward = 'forward',
  reply = 'reply'
}

const ChatMessageItem = (message: { message: Message }) => {
  const ChatService = useService(ChatServiceProvider);
  const activeChat = useTypedSelector((state) => state.activeChat);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { t } = useTranslation();

  const contextOptions = [
    {
      id: optionsConfig.forward,
      render: () => (
        <div className={Style.ChatListItemDropdownItem}>
          <span>{t(`messageListItemDropdown.forward`)}</span>
          <Icon id={optionsConfig.forward} />
        </div>
      )
    },
    {
      id: optionsConfig.reply,
      render: () => (
        <div className={Style.ChatListItemDropdownItem}>
          <span>{t(`messageListItemDropdown.reply`)}</span>
          <Icon id={optionsConfig.reply} />
        </div>
      )
    }
  ];

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsActive(true);
    setIsContextOpen(true);
  };

  const handleContextOptions = (id: string | number) => {
    switch (id) {
      case optionsConfig.forward:
        opened ? close() : open();
        break;
      case optionsConfig.reply:
        ChatService.setReplyMessageInfo({
          chatixChatroomId: activeChat.info!.chatixChatroomId!,
          message: message.message
        });
        break;
      default:
        break;
    }
  };

  const { open, close, opened } = useDropDown();
  const router = useRouter();

  const handleChatItemClick = async (chat: any) => {
    await ChatService.forwardMessage(
      message.message.uuid,
      chat.chatixChatroomId
    );
    close();
    router.push({
      pathname: '/messages',
      query: { id: chat.id }
    });
    ChatService.setActiveChat(chat.id).then(() => {
      ChatService.scrollChatToEnd();
    });
  };

  return (
    <Modal
      position="bottom-left"
      open={isContextOpen}
      onClose={() => {
        setIsActive(false);
        setIsContextOpen(false);
      }}
      options={contextOptions}
      classNameModalBody={Style.ChatMessageDropDown}
      onOptionSelect={(id: string | number) => {
        handleContextOptions(id);
        setIsActive(false);
        setIsContextOpen(false);
      }}
    >
      <div
        className={`${Style.ChatMessageItem} ${
          isActive ? Style.ChatMessageActive : ''
        }`}
        onContextMenu={handleClick}
      >
        <ChatMessage message={message.message} />
      </div>
      {opened && (
        <ShareModal
          close={close}
          isActive={opened}
          onChatItemClick={handleChatItemClick}
        />
      )}
    </Modal>
  );
};

const ChatMessagesContainer: FC<IChatMessagesContainer> = ({
  date,
  messages
}) => {
  const { isVisible, containerRef } = useOnScreen();
  const dateMsg = format(new Date(date), 'MMMM dd');
  const { info } = useTypedSelector((state) => state.activeChat);
  const { setActiveChatReadMessages } = useActions(ActiveChatSlice);
  if (info?.unreadCount && info.unreadCount > 0) {
    const ids = messages.map((m) => m.uuid!);
    const readMessages = async () => {
      await ChatixService.readMessages(ids, info.chatixChatroomId).then(() => {
        setActiveChatReadMessages();
      });
    };
    readMessages();
  }
  return (
    <div className="date-msg">
      <div
        className={[
          Style.DateMessage,
          isVisible && Style.DateMessageSticky
        ].join(' ')}
        ref={containerRef}
      >
        {dateMsg}
      </div>
      <div className={Style.ContainerMessages}>
        {(messages || []).map((i) => (
          <ChatMessageItem key={i.uuid} message={i as unknown as Message} />
        ))}
      </div>
    </div>
  );
};

export default ChatMessagesContainer;
