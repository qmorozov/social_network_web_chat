import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Style from './DeviceItem.module.scss';
import Icon from '../../../component/icon/Icon';

enum DeviceType {
  smartphone = 'smartphone',
  computer = 'computer'
}

type DeviceString = keyof typeof DeviceType;

export interface IDeviceItem {
  smartphoneName?: string;
  deviceStatus: boolean;
  deviceType: DeviceString;
  location: string;
  lastSeen?: string;
}

const DeviceItem: FC<IDeviceItem> = ({
  deviceStatus,
  deviceType,
  location,
  lastSeen,
  smartphoneName
}) => {
  const { t } = useTranslation();
  return (
    <div className={Style.wrapper}>
      <div
        className={`${Style.device__icon} ${
          deviceStatus ? `${Style.online}` : ''
        }`}
      >
        <Icon id={`device-${deviceType}`} />
      </div>
      <div className={Style.info}>
        <h3 className={Style.title}>{t(`${smartphoneName}`)}</h3>
        <h4 className={Style.subtitle}>
          {t(`${location}`)} — {deviceStatus ? t('Online') : lastSeen}
        </h4>
      </div>
      <Icon id="angle-right" width={8} height={14} />
    </div>
  );
};

export default DeviceItem;
