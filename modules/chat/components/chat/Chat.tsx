import { FC, ReactNode } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import Loader from '../../../../component/loader/Loader';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';

interface IChat {
  customHeader?: ReactNode;
  link?: string | undefined;
  setIsFirstMessage?: (b: boolean) => void;
  getChatList?: (date?: string, takeBefore?: boolean) => void;
}

const Chat: FC<IChat> = ({
  customHeader,
  link,
  setIsFirstMessage,
  getChatList
}) => {
  const activeChat = useTypedSelector((state) => state.activeChat);

  if (!activeChat?.info) {
    return null;
  }

  if (activeChat.loading) {
    return <Loader />;
  }

  return (
    <>
      {customHeader ? customHeader : <ChatHeader />}
      <ChatMessageList />
      <ChatMessageInput
        getChatList={getChatList ? getChatList : () => {}}
        link={link}
        setIsFirstMessage={setIsFirstMessage}
      />
    </>
  );
};

export default Chat;
