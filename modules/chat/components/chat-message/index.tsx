import { FC } from 'react';
import { Message, MessageType, TextMessage } from '@chatix/core-ts';
import CompositeAttachmentMessageView from './composite-attachment-message/CompositeAttachmentMessageView';
import TextMessageView from './text-message/TextMessageView';
import { CompositeAttachmentMessage } from '@chatix/core-ts/dist/esm/core/Message';

interface IChatMessage {
  message: Message;
}

const ChatMessage: FC<IChatMessage> = ({ message }) => {
  switch (message.type) {
    case MessageType.compositeAttachmentMessage:
      return (
        <CompositeAttachmentMessageView
          message={message as CompositeAttachmentMessage}
        />
      );
    default:
      return <TextMessageView message={message as TextMessage} />;
  }
};

export default ChatMessage;
