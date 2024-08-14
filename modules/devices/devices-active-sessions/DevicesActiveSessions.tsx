import React, { FC } from 'react';
import DeviceItem from '../device-item/DeviceItem';
import { useTranslation } from 'react-i18next';
import Style from './DevicesActiveSessions.module.scss';
import { MackDevicesActiveSessions } from '../../../mock-data/devices-active-sessions';

const DevicesActiveSessions: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={Style.wrapper}>
      <h2 className={Style.title}>
        {t('settings.device.active-sessions-title')}
      </h2>
      <div className={Style.items}>
        {MackDevicesActiveSessions.map((item, index: number) => (
          <DeviceItem
            key={`${item}_${index}`}
            smartphoneName={item.smartphoneName}
            deviceStatus={item.deviceStatus}
            deviceType={item.deviceType}
            location={item.location}
            lastSeen={item.lastSeen}
          />
        ))}
      </div>
    </div>
  );
};

export default DevicesActiveSessions;
