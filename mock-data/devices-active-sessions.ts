import { IDeviceItem } from '../modules/devices/device-item/DeviceItem';

export const MackDevicesActiveSessions = [
  {
    smartphoneName: 'Precision 5530',
    deviceStatus: false,
    deviceType: 'smartphone',
    location: 'Kyiv, Ukraine',
    lastSeen: 'Mon 14:10'
  },
  {
    smartphoneName: 'MS-7A34',
    deviceStatus: false,
    deviceType: 'computer',
    location: 'Kyiv, Ukraine',
    lastSeen: 'Sat 12:27'
  },
  {
    smartphoneName: 'MS-7A34',
    deviceStatus: false,
    deviceType: 'computer',
    location: 'Kyiv, Ukraine',
    lastSeen: 'Sat 12:27'
  }
] as Array<IDeviceItem>;

export const MockThisDevice: IDeviceItem = {
  smartphoneName: 'Xiaomi Mi 9T Pro',
  deviceStatus: true,
  deviceType: 'computer',
  location: 'Kyiv, Ukraine'
};
