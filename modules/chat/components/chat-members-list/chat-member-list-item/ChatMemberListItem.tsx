import { FC, MouseEvent } from 'react';
import { Sender } from '../../../models/Sender';
import { useService } from '../../../../../hooks/useService';
import { ChatServiceProvider } from '../../../chat.service';
import Avatar from '../../../../../component/avatar/Avatar';
import Icon from '../../../../../component/icon/Icon';

import Style from './ChatMemberListItem.module.scss';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';

interface IMember {
  member: Sender;
  onMemberSelect: () => void;
  chatId: string | null;
}

const ChatMemberListItem: FC<IMember> = ({
  member,
  onMemberSelect,
  chatId
}) => {
  const ChatService = useService(ChatServiceProvider);
  const chatCreatorId = useTypedSelector(
    (state: any) => state.activeChat.info?.creatorId
  );
  const userId = useTypedSelector(({ user }) => user!.user!.id);

  const avatarOptions = {
    url: member?.photoFileName,
    background: member?.defaultAvatarBackground,
    isOnline: member?.isOnline,
    name: member?.name,
    showOnlineStatus: true,
    type: member.type
  };

  const onMemberDelete = (event: MouseEvent<HTMLSpanElement>, id: string) => {
    event.stopPropagation();
    ChatService.deleteGroupChatMember(chatId!, id);
  };

  return (
    <div className={Style.MemberItem} onClick={onMemberSelect}>
      <div className={Style.MemberAvatar}>
        <Avatar options={avatarOptions} />
      </div>
      <p className="trim-text" title={member.name}>
        {member.name}
      </p>
      {chatCreatorId === userId && (
        <span
          className={Style.MemberDelete}
          onClick={(event) => onMemberDelete(event, member.id)}
        >
          <Icon id="delete" />
        </span>
      )}
    </div>
  );
};

export default ChatMemberListItem;
