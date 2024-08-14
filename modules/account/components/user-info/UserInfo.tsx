import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';

import Style from './UserInfo.module.scss';

const UserInfo = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  let website;

  if (user?.website) {
    try {
      website = new URL(user.website)?.hostname;
    } catch (e) {
      website = user?.website || null;
    }
  }

  return (
    <div className={Style.UserInfo}>
      <h2>{user?.name}</h2>
      <p className={Style.UserDescription}>{user?.description}</p>
      {website && (
        <div className={Style.UserWebsite}>
          {t('account.website')}:{' '}
          <a href={user!.website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        </div>
      )}
      <a className={Style.UserEmail} href={`mailto:${user?.email}`}>
        {user?.email}
      </a>
      <div className={Style.InfoBlock}>
        <span className={Style.InfoBlockItem}>
          <Icon id="heart" />
          {user!.likesCount > 0 && user!.likesCount}
        </span>
      </div>
    </div>
  );
};

export default UserInfo;
