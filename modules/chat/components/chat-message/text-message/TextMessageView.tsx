import { FC, useContext } from 'react';
import { FindUrlIntoText } from '../../../../helper';
import ChatMeta from '../../chat-meta/ChatMeta';
import { TextMessage } from '@chatix/core-ts';
import Style from './TextMessageView.module.scss';
import { GroupChat } from '../../chat/ChatMessageList';
import { useAuth } from '../../../../../hooks/useAuth';

interface ITextMessage {
  message: TextMessage;
}

const TextMessageView: FC<ITextMessage> = ({ message }) => {
  const { user } = useAuth();
  const groupChat = useContext(GroupChat);

  return (
    <>
      {message.content ? (
        <div
          className={`message ${Style.wrapper} ${
            user?.chatixId === message.senderId
              ? 'own-message'
              : 'not-own-message'
          }`}
        >
          <span
            className={Style.message__content}
            dangerouslySetInnerHTML={{
              __html: FindUrlIntoText(message.content)
            }}
          ></span>
          <ChatMeta
            classes={Style.meta}
            sentAt={message.sentAt!}
            isReaded={message.isReaded}
          />
        </div>
      ) : null}
    </>
  );
};

export default TextMessageView;
