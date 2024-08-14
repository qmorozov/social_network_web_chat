import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';
import Style from './PillButtonBack.module.scss';

interface IPillButton {
  onClick: () => void;
}

const PillButtonBack: FC<IPillButton> = ({ onClick }: IPillButton) => {
  const { t } = useTranslation();

  return (
    <button className={[Style.Button, 'pill'].join(' ')} onClick={onClick}>
      <div className={Style.ArrowIcon}>
        <Icon id="forward" width={14} height={14} />
      </div>
      <div>{t('button.back')}</div>
    </button>
  );
};

export default PillButtonBack;
