import React, { FC, ReactNode } from 'react';
import { useDropDown } from '../../hooks/useDropDown';
import Style from './Collapse.module.scss';
import Icon from '../icon/Icon';

interface ICollapse {
  title: string;
  children: ReactNode;
  classNameCollapseArrow?: string;
}

const Collapse: FC<ICollapse> = ({
  title,
  children,
  classNameCollapseArrow
}) => {
  const { opened, toggle } = useDropDown();

  return (
    <div className={Style.CollapseWrapper}>
      <div
        onClick={toggle}
        className={[
          Style.CollapseHeader,
          opened && Style.CollapseHeaderOpen
        ].join(' ')}
      >
        <h3>{title}</h3>
        <div
          className={[
            Style.CollapseArrow,
            !opened && Style.CollapsedArrowRotate,
            classNameCollapseArrow
          ].join(' ')}
        >
          <Icon id="collapse-arrow" />
        </div>
      </div>
      <div
        className={[
          Style.CollapseContent,
          opened && Style.CollapseContentShow
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
