import React, { FC } from 'react';
import Style from './SettingsList.module.scss';

interface ISettings {
  settings: SItem[];
  setSettings: (settings: SItem[]) => void;
}

type SItem = {
  id: number;
  title: string;
  desc: string;
  enabled: boolean | undefined;
};

const SettingsList: FC<ISettings> = ({ settings, setSettings }) => {
  const changeHandler = (id: number) => {
    const newSettings = settings.map((s) => {
      if (s.id === id) {
        s.enabled = !s.enabled;
      }
      return s;
    });
    setSettings(newSettings);
  };

  return (
    <>
      {settings.map((item) => (
        <div className={Style.SettingsListItem} key={item.id}>
          <div>
            <p>{item.title}</p>
            <span>{item.desc}</span>
          </div>
          <div>
            <input
              type="checkbox"
              onChange={() => changeHandler(item.id)}
              checked={item.enabled}
              className="switch"
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SettingsList;
