import React, { useContext, useEffect, useRef } from 'react';
import ElementPopper from 'react-element-popper';
import 'react-element-popper/build/element_popper.css';
import { useOutside } from '../../hooks/useOutside';
import { ProfileType } from '../../modules/chat/models/Sender';
import { DropdownPortalContext } from '../../pages/_app';

import Style from './Modal.module.scss';

export type Options = {
  id: number | string;
  selectedType?: ProfileType | string;
  render: () => React.ReactElement;
  url?: string;
};

interface IModal {
  children?: React.ReactNode;
  onClose: () => void;
  open?: boolean;
  options: Options[];
  onOptionSelect: (
    id: number | string,
    event?: React.MouseEvent<HTMLElement> | undefined,
    selectedType?: ProfileType | string
  ) => void;
  position?: string;
  arrow?: boolean;
  classNameModalBody?: string;
  offsetX?: number;
  offsetY?: number;
}

const Modal = ({
  children,
  onClose,
  open,
  options,
  onOptionSelect,
  position,
  arrow,
  classNameModalBody,
  offsetX,
  offsetY
}: IModal) => {
  const ref = useRef<any>(null);
  const refBody = useRef(null);

  useOutside(refBody, onClose);

  useEffect(() => {
    if (open) {
      document.body.classList.add('with-overlay');
    } else {
      document.body.classList.remove('with-overlay');
    }
    ref.current && ref.current.refreshPosition();
  }, [open]);

  const dropdownTarget = useContext(DropdownPortalContext);

  return (
    <ElementPopper
      portal
      zIndex={2000}
      portalTarget={dropdownTarget!}
      element={<>{children}</>}
      ref={ref}
      containerClassName={Style.Container}
      popper={
        open ? (
          <>
            <div
              ref={refBody}
              className={`${Style.ModalBody} ${
                classNameModalBody ? classNameModalBody : ''
              }`}
            >
              {options.map((item, idx) => (
                <div
                  key={idx}
                  className={Style.ModalOption}
                  onClick={(e) => {
                    onOptionSelect(item.id, e, item?.selectedType as string);
                  }}
                >
                  {item.render()}
                </div>
              ))}
            </div>
          </>
        ) : (
          <></>
        )
      }
      popperShadow
      arrow={open && arrow}
      position={position || 'right'}
      offsetX={offsetX}
      offsetY={offsetY}
    />
  );
};

export default Modal;
