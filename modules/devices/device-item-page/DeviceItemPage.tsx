import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../../layouts/main';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import PageTitle from '../../../component/page-title/PageTitle';
import Button from '../../../component/button/Button';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import Style from './DeviceItemPage.module.scss';
import { Route, route } from '../../../config/route';

interface IDeviceItemPage {
  title: string;
  time: string;
  application: string;
  ipAddress: string;
  location: string;
}

const DeviceItemPage: FC<IDeviceItemPage> = ({
  title,
  time,
  application,
  ipAddress,
  location
}) => {
  const { t } = useTranslation();
  // const breadcrumbs = [
  //   { route: route(Route.settings).link(), title: route(Route.settings).title },
  //   { route: route(Route.devices).link(), title: route(Route.devices).title },
  //   { route: '/', title: title }
  // ];
  return (
    <MainLayout>
      <AppSide type="left" className="-ls">
        {/*<Breadcrumbs crumbs={breadcrumbs} />*/}
      </AppSide>
      <AppContent>
        <PageTitle title={title} />
        <div className="page-content">
          <h2 className={Style.title}>{title}</h2>
          <span className={Style.time}>{time}</span>
          <div className={Style.items}>
            <div className={Style.item}>
              <h3 className={Style.item__title}>
                {t('settings.device.application')}
              </h3>
              <p className={Style.item__info}>{application}</p>
            </div>
            <div className={Style.item}>
              <h3 className={Style.item__title}>
                {t('settings.device.ip-address')}
              </h3>
              <p className={Style.item__info}>{ipAddress}</p>
            </div>
            <div className={Style.item}>
              <h3 className={Style.item__title}>
                {t('settings.device.location-based-on-the-ip-address')}
              </h3>
              <p className={Style.item__info}>{location}</p>
            </div>
          </div>
          <Button>{t('settings.device.terminate-session-button')}</Button>
        </div>
      </AppContent>
      <AppSide type="right" />
    </MainLayout>
  );
};

export default DeviceItemPage;
