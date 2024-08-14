import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import Style from './Popup.module.scss';

interface IPopup {
  children: ReactNode;
  opened: boolean;
  onClose: () => void;
  classNames?: string;
}

const Popup: FC<IPopup> = ({
  children,
  opened,
  onClose,
  classNames
}: IPopup) => {
  const [popupEl, setPopupEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setPopupEl(document.querySelector('#popup') as HTMLDivElement);
  }, []);

  if (!popupEl) {
    return null;
  }

  return createPortal(
    <div
      className={[Style.Popup, opened ? Style.PopupOpen : ''].join(' ')}
      onClick={onClose}
    >
      <div
        className={[
          Style.PopupBody,
          opened ? Style.PopupBodyOpen : '',
          classNames
        ].join(' ')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>,
    popupEl
  );
};

export default Popup;
