import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Style from './ConfirmBtn.module.scss';

interface IConfirmBtn {
  onCancel: () => void;
  onAccept: () => void;
}

export const ConfirmBtn: FC<IConfirmBtn> = ({ onCancel, onAccept }) => {
  const { t } = useTranslation();

  const onDecline = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <div>
      <button className={Style.UserMenuDropdownButton} onClick={onDecline}>
        {t('userMenu.no')}
      </button>
      <button className={Style.UserMenuDropdownButton} onClick={onAccept}>
        {t('userMenu.yes')}
      </button>
    </div>
  );
};
