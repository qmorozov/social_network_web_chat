import React, { FC } from 'react';
import DeviceItem from '../device-item/DeviceItem';
import { useTranslation } from 'react-i18next';
import Style from './ThisDevice.module.scss';
import { MockThisDevice } from '../../../mock-data/devices-active-sessions';

const ThisDevice: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={Style.wrapper}>
      <h2 className={Style.title}>{t('settings.device.this-device-title')}</h2>
      <DeviceItem
        smartphoneName={MockThisDevice.smartphoneName}
        deviceStatus={MockThisDevice.deviceStatus}
        deviceType={MockThisDevice.deviceType}
        location={MockThisDevice.location}
      />
      <button className={Style.button}>
        {t('settings.device.terminate-other-sessions-button')}
      </button>
    </div>
  );
};

export default ThisDevice;
