import { FC } from 'react';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';

interface IBackBtn {
  onClick: () => void;
}

const BackBtn: FC<IBackBtn> = ({ onClick }) => {
  return (
    <Button icon onClick={onClick}>
      <Icon id="a-back" width={14} height={14} />
    </Button>
  );
};

export default BackBtn;
