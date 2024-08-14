import React from 'react';
import Link from 'next/link';
import HeaderStyle from './AppHeader.module.scss';
import { useAuth } from '../../hooks/useAuth';
import { Route, route } from '../../config/route';
import { useTranslation } from 'react-i18next';
import UserMenu from './user-menu/UserMenu';
import Icon from '../icon/Icon';
import { useRouter } from 'next/router';
import OpenChat from '../../modules/company/components/open-chat/OpenChat';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useService } from '../../hooks/useService';
import { ChatServiceProvider } from '../../modules/chat/chat.service';

interface IAppHeader {
  menu?: boolean;
  user?: boolean;
  className?: string;
}

const AppHeader: React.FC<IAppHeader> = ({
  menu = true,
  user = true,
  className
}) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const router = useRouter();
  const account = useTypedSelector(({ user }) => user);
  const ChatService = useService(ChatServiceProvider);

  return (
    <header className={[HeaderStyle.appHeader, className].join(' ')}>
      <div className="app-layout">
        <div
          className={['al-side', '-left', HeaderStyle.appHeaderLogoSide].join(
            ' '
          )}
        >
          <Link href={'/'}>
            <a>
              <img src="/logo.svg" alt="" />
            </a>
          </Link>
        </div>

        {menu && (
          <ul className={['al-main', HeaderStyle.appHeaderMenu].join(' ')}>
            <li
              className={
                router.pathname === route(Route.map).link()
                  ? HeaderStyle.activeMenu
                  : ''
              }
            >
              <Link href={route(Route.map).link()}>
                <a className={HeaderStyle.headerItem}>
                  <Icon id="map-mark" width={12} height={14} />
                  <span>{t(route(Route.map).title)}</span>
                </a>
              </Link>
            </li>
            <li
              className={
                router.pathname === route(Route.messages).link()
                  ? HeaderStyle.activeMenu
                  : ''
              }
              onClick={() => ChatService.setActiveChat()}
            >
              <Link href={route(Route.messages).link()}>
                <a className={HeaderStyle.headerItem}>
                  <Icon id="chat" width={14} height={14} />
                  <span>{t(route(Route.messages).title)}</span>
                </a>
              </Link>
            </li>

            <li
              className={
                router.pathname === route(Route.feed).link()
                  ? HeaderStyle.activeMenu
                  : ''
              }
            >
              <Link href={route(Route.feed).link()}>
                <a className={HeaderStyle.headerItem}>
                  <Icon id="feed" width={15} height={14} />
                  <span>{t(route(Route.feed).title)}</span>
                </a>
              </Link>
            </li>

            <li>
              <OpenChat companyId={null} chatId={null}>
                <a className={HeaderStyle.headerItem}>
                  <Icon id="heart" width={15} height={14} />
                  {t('favorites.title')}
                </a>
              </OpenChat>
            </li>
          </ul>
        )}

        {user && (
          <div
            className={[
              'al-side',
              '-right',
              HeaderStyle.appHeaderUserSide
            ].join(' ')}
          >
            {auth.signed && auth.user ? (
              <UserMenu user={auth.user} />
            ) : (
              <Link href={route(Route.auth).link()}>
                <a>{t('_.login')}</a>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
