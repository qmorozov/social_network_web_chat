import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Icon from '../../component/icon/Icon';
import Style from './getMobileApp.module.scss';

const GetMobileApp: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={Style.wrapper}>
      <Link href={'/'}>
        <a className={Style.logo}>
          <img src="/logo.svg" alt="logo" />
        </a>
      </Link>
      <h1 className={Style.title}>{t('getMobileApp.title')}</h1>
      <p className={Style.text}>{t('getMobileApp.text')}</p>
      <div className={Style.buttons}>
        <a className={Style.button} href="/">
          <Icon id="app-store" width={12} height={14} />
          {t('getMobileApp.app-store')}
        </a>
        <a className={Style.button} href="/">
          <Icon id="google-play" width={12} height={13} />
          {t('getMobileApp.google-play')}
        </a>
      </div>
      <div className={Style.image}>
        <img src="/mobile-app.png" alt="mobile app" />
      </div>
    </div>
  );
};

export default GetMobileApp;
