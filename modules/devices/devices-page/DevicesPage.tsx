import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import PageTitle from '../../../component/page-title/PageTitle';
import ThisDevice from '../this-device/ThisDevice';
import DevicesActiveSessions from '../devices-active-sessions/DevicesActiveSessions';
import Button from '../../../component/button/Button';

const DevicesPage: FC = () => {
  const { t } = useTranslation();
  // const breadcrumbs = [
  //   { route: route(Route.settings).link(), title: route(Route.settings).title },
  //   { route: route(Route.devices).link(), title: route(Route.devices).title }
  // ];
  return (
    <>
      <AppSide type="left" className="-ls">
        {/*<Breadcrumbs crumbs={breadcrumbs} />*/}
      </AppSide>
      <AppContent>
        <PageTitle title={'settings.device.title'} />
        <div className="page-content">
          <ThisDevice />
          <DevicesActiveSessions />
          <Button>{t('settings.device.link-desktop-device-button')}</Button>
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default DevicesPage;
