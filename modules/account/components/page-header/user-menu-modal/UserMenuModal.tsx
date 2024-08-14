import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import MenuDots from '../../../../../component/menu-dots/MenuDots';
import Modal from '../../../../../component/modal/Modal';
import Icon from '../../../../../component/icon/Icon';
import Style from '../PageHeader.module.scss';

enum optionsConfig {
  statistics = 'statistics',
  settings = 'settings'
}

const UserMenuModal = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const options = [
    {
      id: optionsConfig.statistics,
      render: () => (
        <div className={Style.userMenuOptionsItem}>
          {t('userMenuDropDown.statistics')}
          <Icon id="statistics" width={18} height={16} />
        </div>
      ),
      url: '/'
    },
    {
      id: optionsConfig.settings,
      render: () => (
        <div className={Style.userMenuOptionsItem}>
          {t('userMenuDropDown.settings')}
          <Icon id="user-settings" width={18} height={15} />
        </div>
      ),
      url: '/'
    }
  ];
  const onOptionSelectHandler = (id: number | string) => {
    const url = options.find((o) => o.id === id)?.url || '/';
    router.push(url);
  };
  return (
    <Modal
      position="bottom-right"
      open={isContextOpen}
      onClose={() => setIsContextOpen(false)}
      options={options}
      classNameModalBody={Style.UserMenuModalBody}
      onOptionSelect={(idx) => {
        onOptionSelectHandler(idx);
        setIsContextOpen(false);
      }}
      offsetY={12}
    >
      <div onClick={() => setIsContextOpen(true)}>
        <MenuDots />
      </div>
    </Modal>
  );
};

export default UserMenuModal;
