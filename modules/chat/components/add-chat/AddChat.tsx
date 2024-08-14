import { FC } from 'react';
import { useDropDown } from '../../../../hooks/useDropDown';
import GroupDetails from '../group-details/GroupDetails';
import NewChat from '../new-chat/NewChat';

interface IAddChat {
  closeAddChat: () => void;
}

const AddChat: FC<IAddChat> = ({ closeAddChat }) => {
  const {
    opened: openedAddGroup,
    open: openAddGroup,
    close: closeAddGroup
  } = useDropDown();

  return openedAddGroup ? (
    <GroupDetails closeAddGroup={closeAddGroup} />
  ) : (
    <NewChat closeAddChat={closeAddChat} openAddGroup={openAddGroup} />
  );
};

export default AddChat;
