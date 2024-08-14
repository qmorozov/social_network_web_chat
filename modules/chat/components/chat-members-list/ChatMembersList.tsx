import { FC } from 'react';
import { Sender } from '../../models/Sender';
import ChatMemberListItem from './chat-member-list-item/ChatMemberListItem';

interface IMemberProps {
  members: Sender[];
  onMemberSelect: (id: string) => void;
  chatId: string | null;
}

const ChatMembersList: FC<IMemberProps> = ({
  members,
  onMemberSelect,
  chatId
}) => {
  return (
    <>
      {members.map((member: Sender) => (
        <ChatMemberListItem
          key={member.id}
          member={member}
          onMemberSelect={() => onMemberSelect(member.id)}
          chatId={chatId}
        />
      ))}
    </>
  );
};

export default ChatMembersList;
