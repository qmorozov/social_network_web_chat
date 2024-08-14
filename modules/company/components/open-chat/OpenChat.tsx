import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';
import { Route, route } from '../../../../config/route';
import { useService } from '../../../../hooks/useService';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ChatServiceProvider } from '../../../chat/chat.service';
import { CompanyChatProvider } from '../../services/company-chat.service';

interface IOpenChat {
  chatId: string | null | undefined;
  companyId: string | null;
  children: ReactNode;
  callback?: () => void;
  classes?: string;
  popupChat?: boolean;
}

const OpenChat: FC<IOpenChat> = ({
  chatId,
  companyId,
  children,
  callback,
  classes,
  popupChat = false
}: IOpenChat) => {
  const { postChat } = useService(CompanyChatProvider);
  const router = useRouter();
  const { user } = useTypedSelector((state) => state);
  const ChatService = useService(ChatServiceProvider);

  const goChatId = (idChat: string) => {
    console.log(idChat);
    if (popupChat) {
      ChatService.setActiveChat(idChat);
    } else {
      router.push({
        pathname: '/messages',
        query: { id: idChat }
      });
    }
  };

  const createChat = async () => {
    if (!user.signed) {
      return router.push({
        pathname: route(Route.auth).link(),
        query: {
          redirectTo: router.asPath
        }
      });
    }
    if (chatId) {
      goChatId(chatId);
      callback && callback();
    } else {
      await postChat(companyId, goChatId).then(() => {
        callback && callback();
      });
    }
  };

  return (
    <div
      className={classes ? classes : ''}
      onClick={() => {
        createChat();
      }}
    >
      {children}
    </div>
  );
};

export default OpenChat;
