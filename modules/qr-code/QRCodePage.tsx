import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../config/route';
import AppSide from '../../component/app-side/AppSide';
import AppContent from '../../component/app-content/AppContent';
import PageTitle from '../../component/page-title/PageTitle';
import Breadcrumbs from '../../component/breadcrumbs/Breadcrumbs';
import QRCode from 'react-qr-code';
import Style from '../../styles/page/QRCode.module.scss';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const QRCodePage: FC = () => {
  const { t } = useTranslation();
  const breadcrumbs = [
    { route: route(Route.settings).link(), title: route(Route.settings).title },
    { route: route(Route.qrCode).link(), title: route(Route.qrCode).title }
  ];
  const { selectedCompany, user } = useTypedSelector(({ user }) => user);
  const qrValue = `https://busineschat.com/${selectedCompany ?? user?.id}`;
  return (
    <>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent padding="wide">
        <PageTitle title={'settings.qr-code.title'} />
        <div className={`${Style.wrapper} page-content`}>
          <div className={Style.qrCode}>
            <QRCode value={qrValue} size={200} />
          </div>
          <h2 className={Style.subtitle}>{t('settings.qr-code.subtitle')}</h2>
          <ol className={Style.list}>
            <li className={Style.listItem}>
              {t('settings.qr-code.first-step')}
            </li>
            <li className={Style.listItem}>
              {t('settings.qr-code.second-step')}
            </li>
            <li className={Style.listItem}>
              {t('settings.qr-code.third-step')}
            </li>
          </ol>
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default QRCodePage;
