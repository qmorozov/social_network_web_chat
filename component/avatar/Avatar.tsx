import { FC, useEffect, useState } from 'react';
import { ProfileType } from '../../modules/chat/models/Sender';
import Style from './Avatar.module.scss';
import { AppData } from '../../services/app';
import { ChatixService } from '../../modules/chatix/chatix.service';

export interface IAvatar {
  options: {
    url: string | undefined | null;
    showOnlineStatus?: boolean;
    background: string | undefined;
    isOnline?: boolean | undefined;
    type?: ProfileType;
    name: string | undefined | null;
  };
  onlineIndicatorFor?: string;
  classes?: string;
}

const Avatar: FC<IAvatar> = ({
  options,
  classes,
  onlineIndicatorFor
}: IAvatar) => {
  const [isOnline, setIsOnline] = useState(false);

  const {
    url,
    showOnlineStatus = false,
    background,
    type = ProfileType.user,
    name
  } = options;

  useEffect(() => {
    if (options?.showOnlineStatus && onlineIndicatorFor) {
      ChatixService.isOnline(onlineIndicatorFor).then((s) => setIsOnline(!!s));
    }
  }, []);

  const showSign = url ? null : (name || '').slice(0, 1).toUpperCase();
  return (
    <div
      className={[
        Style.Avatar,
        classes ? classes : '',
        type === ProfileType.business ? Style.AvatarBusiness : ''
      ].join(' ')}
      style={{
        backgroundImage: AppData.avatarUrlPathStyle(url),
        backgroundColor: background
      }}
    >
      {url ? null : showSign}
      {showOnlineStatus && isOnline && (
        <div className={Style.AvatarOnline}></div>
      )}
    </div>
  );
};

export default Avatar;
