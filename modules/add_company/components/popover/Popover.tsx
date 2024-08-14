import { FC, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import Style from './Popover.module.scss';
import { useDropDown } from '../../../../hooks/useDropDown';

interface IPopover {
  btnContent: any;
  children: any;
}

const PopoverModal: FC<IPopover> = ({ btnContent, children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover className={Style.Popover}>
      <Popover.Button ref={buttonRef} className={Style.PopoverButton}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            buttonRef?.current?.click();
          }}
        >
          {btnContent}
        </div>
      </Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className={Style.PopoverPanel}>{children}</Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default PopoverModal;
