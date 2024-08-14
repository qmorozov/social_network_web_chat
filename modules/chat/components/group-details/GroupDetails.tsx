import { FC, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';
import { useService } from '../../../../hooks/useService';
import { useAppDispatch } from '../../../../services/app-store';
import { ChatServiceProvider } from '../../chat.service';
import { CreateChatSlice } from '../../stores/create-chat.store';
import BackBtn from '../back-btn/BackBtn';
import Style from './GroupDetails.module.scss';
import Input from '../../../../component/input/Input';

interface IGroupDetails {
  closeAddGroup: () => void;
}

const GroupDetails: FC<IGroupDetails> = ({ closeAddGroup }) => {
  const dispatch = useAppDispatch();
  const ChatService = useService(ChatServiceProvider);
  const { t } = useTranslation();
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const [groupName, setGroupName] = useState('');
  const [photoName, setPhotoName] = useState('');

  const handleClick = () => {
    hiddenFileInput?.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target?.value);
    dispatch(CreateChatSlice.actions.setChatName(e.target?.value));
  };

  const clickAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ChatService.postGroupChats();
  };

  const isDisabled = !groupName;

  return (
    <div className={Style.GroupDetails}>
      <form onSubmit={clickAdd}>
        <fieldset className={Style.GroupDetailsHeader}>
          <div onClick={closeAddGroup}>
            <BackBtn onClick={closeAddGroup} />
            <span>{t('create-chat.group-details.title')}</span>
          </div>
          <Button type="submit" classes={Style.AddBtn} disabled={isDisabled}>
            {t('create-chat.group-details.btn-add')}
            {isDisabled ? (
              <Icon id="a-right" width={17} height={12} />
            ) : (
              <Icon id="a-right-white" width={17} height={12} />
            )}
          </Button>
        </fieldset>
        <fieldset className={Style.GroupDetailsInput}>
          <div className="form-control">
            <div className={Style.AddPhoto} onClick={handleClick}>
              <span>
                {photoName
                  ? photoName
                  : t('create-chat.group-details.add-photo')}
              </span>
              <Icon id="attach" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              className="control -single"
              onChange={(e) => setPhotoName(e.target.files![0].name)}
            />
          </div>
          <Input
            value={groupName}
            onChange={handleChange}
            classes={Style.Input}
            placeholder={t('create-chat.group-details.placeholder')}
          />
        </fieldset>
      </form>
    </div>
  );
};

export default GroupDetails;
