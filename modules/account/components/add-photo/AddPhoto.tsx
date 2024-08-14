import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../hooks/useAuth';
import { Route, route } from '../../../../config/route';
import Avatar, { IAvatar } from '../../../../component/avatar/Avatar';
import AccountEditModal from '../account-edit-modal/AccountEditModal';

import Style from './AddPhoto.module.scss';

const AddPhoto = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const avatarOptions: IAvatar['options'] = {
    url: user?.photoFileName,
    background: user?.defaultAvatarBackground,
    name: user?.name
  };

  return (
    <div className={Style.wrapper}>
      <div className={Style.PhotoWrapper}>
        {user?.photoFileName ? (
          <Avatar options={avatarOptions} classes={Style.Photo} />
        ) : (
          <Link href={route(Route.AccountAddingPhoto).link()}>
            <a className={Style.Content}>
              <Avatar options={avatarOptions} classes={Style.Photo} />
              <span>{t('account.add-photo')}</span>
            </a>
          </Link>
        )}
      </div>
      <div className={Style.button}>
        <AccountEditModal />
      </div>
    </div>
  );
};

export default AddPhoto;
