import React, { FC, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Route, route } from '../../../../config/route';
import { useTranslation } from 'react-i18next';
import { useDropDown } from '../../../../hooks/useDropDown';
import { useService } from '../../../../hooks/useService';
import { AuthServiceProvider } from '../../../../modules/auth/auth.service';
import Icon from '../../../icon/Icon';
import MenuDots from '../../../menu-dots/MenuDots';
import Modal from '../../../modal/Modal';
import Style from './UserMenuDropdown.module.scss';

enum UserMenuDropdownConfig {
  qrCode = 'qrCode',
  privacyPolicy = 'privacyPolicy',
  faq = 'faq',
  logOut = 'logOut'
}

const UserMenuDropdown: FC = () => {
  const AuthService = useService(AuthServiceProvider);
  const router = useRouter();
  const { t } = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  const [showConfirmLogOut, setShowConfirmLogOut] = useState(false);
  const { opened, open, close } = useDropDown();

  const logOutHandler = (e: React.MouseEvent<HTMLElement> | undefined) => {
    e && e.preventDefault();
    setShowConfirmLogOut(true);
  };

  const onDeclineLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowConfirmLogOut(false);
  };

  const onAcceptLogout = () => {
    ref.current && ref.current.click();
    // fix later
    AuthService.logout();
    close();
  };

  const options = [
    {
      id: UserMenuDropdownConfig.qrCode,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('userMenu.qrCode')}
          <Icon id="qr" />
        </div>
      ),
      url: route(Route.qrCode).link()
    },
    {
      id: UserMenuDropdownConfig.privacyPolicy,
      render: () => (
        <a
          className={Style.UserMenuDropdownItem}
          href="https://busineschat.com/?page_id=61"
          target="_blank"
          rel="noreferrer"
        >
          {t('userMenu.privacyPolicy')}
          <Icon id="privacy-policy" />
        </a>
      )
    },
    {
      id: UserMenuDropdownConfig.faq,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('userMenu.faq')} <Icon id="faq" />
        </div>
      ),
      url: route(Route.faq).link()
    },
    {
      id: UserMenuDropdownConfig.logOut,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          <span>{t('userMenu.logOut')}</span>
          {showConfirmLogOut ? (
            <div>
              <button
                className={Style.UserMenuDropdownButton}
                onClick={(e) => onDeclineLogout(e)}
              >
                {t('userMenu.no')}
              </button>
              <button
                className={Style.UserMenuDropdownButton}
                onClick={onAcceptLogout}
              >
                {t('userMenu.yes')}
              </button>
            </div>
          ) : (
            <Icon id="a-right" />
          )}
        </div>
      ),
      url: '/'
    }
  ];

  const onOptionSelectHandler = (
    id: number | string,
    e: React.MouseEvent<HTMLElement> | undefined
  ) => {
    if (id !== UserMenuDropdownConfig.logOut) {
      const url = options.find((o) => o.id === id)?.url || '/';
      router.push(url);
      close();
    } else {
      logOutHandler(e);
    }
  };

  return (
    <Modal
      position="bottom-end"
      open={opened}
      onClose={close}
      options={options}
      classNameModalBody={Style.UserMenuDropdownBody}
      onOptionSelect={(idx, e) => {
        onOptionSelectHandler(idx, e);
      }}
    >
      <div onClick={open}>
        <MenuDots />
      </div>
    </Modal>
  );
};

export default UserMenuDropdown;
