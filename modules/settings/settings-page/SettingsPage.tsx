import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth';
import { UserSlice } from '../../me/store/me';
import { useDispatch, useSelector } from 'react-redux';
import AppContent from '../../../component/app-content/AppContent';
import AppSide from '../../../component/app-side/AppSide';
import SettingsList from './settings-list/SettingsList';
import Dropdown from '../../../component/dropdown/Dropdown';
import PageTitle from '../../../component/page-title/PageTitle';
import Style from './SettingsPage.module.scss';

const SettingsPage: FC = () => {
  const { handleSubmit } = useForm();
  const { user } = useAuth();

  const selectedLanguage = useSelector<any>((user) => user.selectedLanguage);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  // remove later
  const languages = [
    {
      id: 1,
      title: 'English',
      value: 'en'
    },
    {
      id: 2,
      title: 'Spanish',
      value: 'sp'
    },
    {
      id: 3,
      title: 'French',
      value: 'fr'
    }
  ];

  const settingsOptions = [
    {
      id: 1,
      title: t('settings.notification.title'),
      desc: t('settings.notification.desc'),
      enabled: user?.settings.isNotificationEnabled
    }
  ];

  const [settings, setSettings] = useState(settingsOptions);
  const [language, setLanguage] = useState(
    languages.find((l) => l.value === selectedLanguage) || languages[0]
  );

  useEffect(() => {
    dispatch(UserSlice.actions.setLanguage(language.value));
  }, [language]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit = (data: any) => {};

  const [value, setValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([...languages]);

  const options = filteredOptions.map((lang) => ({
    id: lang.id,
    render: () => (
      <div className={Style.SettingsLangOption} key={lang.value}>
        <button>{lang.title}</button>
      </div>
    )
  }));

  const selectLangHandler = (id: number | string) => {
    setLanguage(languages.find((l) => l.id === id) || languages[0]);
    setValue('');
    setFilteredOptions([...languages]);
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setFilteredOptions(() =>
      languages.filter((option) =>
        option.title.toUpperCase().includes(event.target.value.toUpperCase())
      )
    );
  };

  return (
    <>
      <AppSide type="left"></AppSide>
      <AppContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={Style.SettingsContainer}
        >
          <PageTitle title={'settings.title'} classes={Style.PageTitle}>
            <button className={`${Style.button} pill`}>
              {t('settings.save')}
            </button>
          </PageTitle>
          <div className={Style.SettingsDropdown}>
            <Dropdown
              customHeader={
                <div className={Style.SettingsSelect}>
                  <p className={Style.SettingsTitle}>{language.title}</p>
                </div>
              }
              customBodyHeader={
                <div className={Style.SettingsFilter}>
                  <input
                    value={value}
                    onChange={(event) => inputHandler(event)}
                    placeholder={t('settings.languageSearch')}
                  />
                </div>
              }
              customBody={options}
              onOptionSelect={selectLangHandler}
              position={['top', 'left']}
            />
          </div>

          <div className={Style.SettingsList}>
            <SettingsList settings={settings} setSettings={setSettings} />
          </div>
          {/*<div className={Style.SettingsDevices}>*/}
          {/*  <Link href={route(Route.devices).link()}>*/}
          {/*    <a>*/}
          {/*      <div>*/}
          {/*        <span>{t('settings.device.title')}</span>*/}
          {/*        <p>{t('settings.device.connectedDevices')}</p>*/}
          {/*      </div>*/}
          {/*      <Icon id="angle-right" height={8} width={8} />*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </form>
      </AppContent>
      <AppSide type="right"></AppSide>
    </>
  );
};
export default SettingsPage;
