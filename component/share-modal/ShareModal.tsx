import React, { FC, startTransition, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useDropDown } from '../../hooks/useDropDown';
import { useService } from '../../hooks/useService';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { ChatServiceProvider } from '../../modules/chat/chat.service';
import { ChatItem } from '../../modules/chat/models/ChatItem';
import ChatAvatar from '../avatar/ChatAvatar';
import Icon from '../icon/Icon';
import Loader from '../loader/Loader';
import Style from './ShareModal.module.scss';

export type ShareData = {
  title?: string;
  url?: string;
};

interface IShareModal {
  isActive: boolean;
  close: () => void;
  shareData?: ShareData;
  onChatItemClick?: (chat: any) => void;
}

export const navigatorShare = async (data: ShareData) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    useCopyToClipboard(window.location.href);
  }
};

const ShareModal: FC<IShareModal> = ({
  isActive,
  close,
  onChatItemClick,
  shareData
}: IShareModal) => {
  const { t } = useTranslation();

  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const { chats, loading, hasMore, date, takeBefore } = useTypedSelector(
    (state) => state.chats
  );

  const [open, setOpen] = useState<boolean>(isActive);
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>(chats);
  const [search, setSearch] = useState<string>('');

  const ChatService = useService(ChatServiceProvider);

  useEffect(() => {
    startTransition(() => {
      if (filteredChats && search) {
        setFilteredChats(
          chats.filter((chat: any) => {
            if (chat.name) {
              return chat.name
                .toLowerCase()
                .includes(search.toLowerCase().trim());
            } else if (chat.partner.name) {
              return chat.partner.name
                .toLowerCase()
                .includes(search.toLowerCase().trim());
            }
          })
        );
      } else {
        setFilteredChats(chats);
      }
    });
  }, [search]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        close();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!loading) {
      if (!chats.length) {
        ChatService.getList(selectedCompanyId!);
      }
      setFilteredChats(chats);
    }
  }, [chats]);

  const shareHandler = (chat: ChatItem) => {
    onChatItemClick && !shareData
      ? onChatItemClick(chat)
      : ChatService.sendMessage(chat.chatixChatroomId, shareData!.url).then(
          () => {
            setOpen(false);
          }
        );
  };

  return (
    <div
      className={[open ? Style.OpenModal : Style.CloseModal, Style.Modal].join(
        ' '
      )}
      onClick={() => setOpen(false)}
    >
      <div
        className={[
          open ? Style.ModalBodySlideIn : Style.ModalBodySlideOut,
          Style.ModalBody
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <Loader />
        ) : (
          <div className={Style.ModalBodyWrapper}>
            <div className={Style.ModalHeader}>
              <div className={Style.Search}>
                <input
                  type="text"
                  placeholder={t('chat.search-chat-placeholder')}
                  onInput={(e: any) => {
                    setSearch(e.target.value);
                  }}
                />
                <Icon id="search" />
              </div>
              {shareData && (
                <div
                  className={Style.ShareSocials}
                  onClick={async () => {
                    navigatorShare(shareData);
                  }}
                >
                  <Icon id="share" />
                </div>
              )}
            </div>
            <ul className={Style.List}>
              {filteredChats.map((chat) => (
                <li onClick={() => shareHandler(chat)} key={chat.id}>
                  <ChatAvatar chat={chat} />
                  <p>{chat.name || chat.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
