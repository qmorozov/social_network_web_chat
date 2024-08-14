import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactElement } from 'react';
import Style from './Dropdown.module.scss';

enum Position {
  top = 'top',
  left = 'left',
  bottom = 'bottom',
  right = 'right'
}

type PositionString = keyof typeof Position;

interface IDropdown {
  customHeader: ReactElement;
  customBody: customBody[];
  customBodyHeader?: ReactElement;
  onOptionSelect: (
    id: number | string,
    event?: React.MouseEvent<HTMLElement> | undefined
  ) => void;
  position?: PositionString[];
  customHeaderStyle?: string;
  customHeaderStyleOnOpen?: string;
  customBodyHeaderStyle?: string;
  customBodyStyle?: string;
  showCloseButton?: boolean;
  customPositionStyle?: string;
  customOpenState?: boolean;
  enableCustomOpenState?: boolean;
  setCustomOpenState?: (state: boolean) => void;
  scrollDown?: boolean;
}

type customBody = {
  id: number | string;
  render: () => ReactElement;
  url?: string;
};

const Dropdown = ({
  customHeader,
  customBody,
  customBodyHeader,
  onOptionSelect,
  position = ['top', 'left'],
  customHeaderStyle,
  customHeaderStyleOnOpen,
  customBodyHeaderStyle,
  customBodyStyle,
  showCloseButton = true,
  customPositionStyle,
  enableCustomOpenState,
  customOpenState,
  setCustomOpenState,
  scrollDown = false
}: IDropdown) => {
  const generatePositionStyle = (pos: string) => {
    switch (pos) {
      case 'top':
        return Style.Top;
      case 'bottom':
        return Style.Bottom;
      case 'left':
        return Style.Left;
      case 'right':
        return Style.Right;

      default:
        break;
    }
  };

  return (
    <>
      <Menu as="div" className={Style.Dropdown}>
        {({ open }) => {
          const isOpen = enableCustomOpenState ? customOpenState : open;

          return (
            <>
              {isOpen ? (
                <div
                  className="overlap"
                  onClick={() => {
                    enableCustomOpenState && setCustomOpenState
                      ? setCustomOpenState(false)
                      : null;
                  }}
                ></div>
              ) : null}
              <Menu.Button
                className={[
                  Style.Button,
                  customHeaderStyle,
                  isOpen ? customHeaderStyleOnOpen : null
                ].join(' ')}
              >
                {customHeader}
              </Menu.Button>

              <Transition
                show={isOpen}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom={`transform opacity-0 scale-95 h-0 ${
                  scrollDown ? 'h-0' : null
                }`}
                enterTo={`transform opacity-100 scale-100 ${
                  scrollDown ? 'h-100' : null
                }`}
                leave="transition ease-in duration-75"
                leaveFrom={`transform opacity-100 scale-100 h-100 ${
                  scrollDown ? 'h-100' : null
                }`}
                leaveTo={`transform opacity-0 scale-95 h-0 ${
                  scrollDown ? 'h-0' : null
                }`}
              >
                <Menu.Items
                  className={[
                    Style.DropdownBody,
                    customPositionStyle ||
                      position
                        .map((pos) => generatePositionStyle(pos))
                        .join(' '),
                    customBodyStyle
                  ].join(' ')}
                >
                  <React.Fragment>
                    {
                      <div className={customBodyHeaderStyle}>
                        {customBodyHeader}
                      </div>
                    }
                  </React.Fragment>
                  <React.Fragment>
                    {showCloseButton ? (
                      <Menu.Item>
                        <div className={Style.DropdownClose}></div>
                      </Menu.Item>
                    ) : null}
                  </React.Fragment>
                  {customBody.map((item, idx) => (
                    <Menu.Item key={idx}>
                      {() => (
                        <div
                          className={Style.DropdownOption}
                          onClick={(e) => onOptionSelect(item.id, e)}
                        >
                          {item.render()}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </>
          );
        }}
      </Menu>
    </>
  );
};

export default Dropdown;
