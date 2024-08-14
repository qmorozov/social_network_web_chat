import { FC } from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import Icon from '../../../../component/icon/Icon';
import Style from './BtnOpenSelect.module.scss';

interface IBtnOpenSelect {
  title: string | ReactElement;
  isCheck?: boolean;
  onClick?: () => void;
}

const BtnOpenSelect: FC<IBtnOpenSelect> = ({
  title,
  isCheck = false,
  onClick
}) => {
  return (
    <div onClick={onClick}>
      <div className={Style.BtnCategoryOfBusiness}>
        <div className={Style.Title}>{title}</div>
        <div>
          {isCheck ? <Icon id="check" width={12} /> : <Icon id="a-down" />}
        </div>
      </div>
    </div>
  );
};

export default BtnOpenSelect;
