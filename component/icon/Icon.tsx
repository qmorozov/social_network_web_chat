import { FC } from 'react';
import { IconId } from './_icons.type';

interface IIcon {
  id: IconId;
  width?: number;
  height?: number;
  onClick?: () => void;
}

const Icon: FC<IIcon> = ({ id, onClick, height, width }) => {
  return (
    <svg
      style={{ width: width, height: height }}
      className={`icon icon-${id}-dims icon-${id}`}
      onClick={onClick}
    >
      <use xlinkHref={`/icons.svg#${id}`}></use>
    </svg>
  );
};

export default Icon;
