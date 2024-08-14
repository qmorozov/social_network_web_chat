import { FC, useEffect, useState } from 'react';
import { FindUrlIntoText } from '../../../../helper';
import { CompositeAttachmentMessage } from '@chatix/core-ts/dist/esm/core/Message';
import ChatMeta from '../../chat-meta/ChatMeta';
import FileMessageView from '../file-message/FileMessageView';
import LinkMessageView from '../link-message/LinkMessageView';
import ImagesMessageView from '../images-message/ImagesMessageView';
import Style from './CompositeAttachmentMessageView.module.scss';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import Avatar from '../../../../../component/avatar/Avatar';
import AudioMessage from '../audio-message/AudioMessage';
import { useAuth } from '../../../../../hooks/useAuth';
import { BusinessApi } from '../../../../company/company.api';

interface ICompositeAttachmentMessage {
  message: CompositeAttachmentMessage;
}

interface IMessageByType {
  message: any;
  reply: boolean;
}

const MessageByType: FC<IMessageByType> = ({ message, reply }) => {
  return (
    <>
      {message.images?.length ? (
        <ImagesMessageView images={message.images} reply={reply} />
      ) : null}
      {message.audio ? (
        <AudioMessage audio={message.audio} reply={reply} />
      ) : null}
      {message.link ? (
        <LinkMessageView
          url={message.link.url}
          previewUrl={message.link.previewUrl}
          title={message.link.title}
          description={message.link.description}
          reply={reply}
        />
      ) : null}
      {message.files?.length ? (
        <FileMessageView reply={reply} files={message.files} />
      ) : null}
    </>
  );
};

const CompositeAttachmentMessageView: FC<ICompositeAttachmentMessage> = ({
  message
}) => {
  const activeChat = useTypedSelector((state) => state.activeChat);
  const { user } = useAuth();
  let sender = null;

  if (activeChat.members?.length && activeChat.members?.length > 1) {
    const senderInfo = activeChat.members.find(
      (memb) => memb.sender_Id === message?.senderId
    );
    if (!sender) {
      const avatarOptions = {
        url: senderInfo?.photoFileName,
        background: senderInfo?.defaultAvatarBackground,
        isOnline: senderInfo?.isOnline,
        name: senderInfo?.name,
        type: senderInfo?.type
      };
      sender = { ...senderInfo, avatarOptions };
    }
  }

  const isUserMessage = user?.chatixId === message.senderId;

  const [replyAccountInfo, setReplyAccountInfo] = useState({
    url: '',
    background: '',
    isOnline: false,
    name: '',
    type: 0
  });

  const businesses = useTypedSelector(({ user }) => user.user?.businesses);

  const getCompanyInfo = async (id: string) => {
    const company = await BusinessApi.getCompanyById(id);

    setReplyAccountInfo({
      url: company.photoFileName,
      background: company.avatarFillColor,
      isOnline: false,
      name: company.name,
      type: 1
    });
  };

  const getUserInfo = async (id: string) => {
    if (id === user?.chatixId) {
      setReplyAccountInfo({
        url: user.photoFileName || '',
        background: user.defaultAvatarBackground,
        isOnline: false,
        name: user.name || '',
        type: 0
      });
    } else if (activeChat.info) {
      setReplyAccountInfo({
        url: activeChat.info.photoFileName,
        background: activeChat.info.avatarFillColor,
        isOnline: false,
        name: activeChat.info.name,
        type: activeChat.info.partnerType
      });
    }
  };

  useEffect(() => {
    if (message.replyMessage?.businessId) {
      getCompanyInfo(message.replyMessage.businessId);
    }

    if (message.replyMessage?.senderId) {
      getUserInfo(message.replyMessage?.senderId);
    }

    if (activeChat.members?.length) {
      const memberInfo = activeChat.members.filter(
        (member) => member.sender_Id === message.replyMessage?.senderId
      );

      setReplyAccountInfo({
        url: memberInfo[0]?.photoFileName,
        background: memberInfo[0]?.defaultAvatarBackground,
        isOnline: false,
        name: memberInfo[0]?.name,
        type: memberInfo[0]?.type
      });
    }
  }, []);

  return (
    <div className={sender ? Style.WithAvatar : ''}>
      {sender ? (
        <div
          className={`${Style.SenderInfo} ${
            isUserMessage ? Style.SenderInfoRight : ''
          }`}
        >
          <div>
            <Avatar options={sender.avatarOptions} />
          </div>
          <p className={Style.UserName}>{sender.name}</p>
        </div>
      ) : null}
      <>
        <div
          className={`message ${Style.wrapper} ${
            isUserMessage ? 'own-message' : 'not-own-message'
          }`}
        >
          {message.replyMessage ? (
            <div className={Style.reply}>
              <div className={Style.replyUser}>
                <Avatar options={replyAccountInfo} />
                <span>{replyAccountInfo.name}:</span>
              </div>
              {(message.replyMessage as any).content ? (
                <span
                  className="trim-text"
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof (message.replyMessage as any).content === 'object'
                        ? ''
                        : FindUrlIntoText((message.replyMessage as any).content)
                  }}
                ></span>
              ) : (
                <MessageByType message={message.replyMessage} reply={true} />
              )}
            </div>
          ) : null}

          <MessageByType message={message} reply={false} />

          <div className={Style.textWrapper}>
            {message.content && (
              <span
                className={Style.textContent}
                dangerouslySetInnerHTML={{
                  __html:
                    typeof message.content === 'object'
                      ? ''
                      : FindUrlIntoText(message.content)
                }}
              ></span>
            )}
            <ChatMeta sentAt={message.sentAt!} isReaded={message.isReaded} />
          </div>
        </div>
      </>
    </div>
  );
};

export default CompositeAttachmentMessageView;
