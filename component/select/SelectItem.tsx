import React, { FC, Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { TextHighlight } from '../text-highlight/TextHighlight';
import { ISelectItem } from './dto/Select';
import SelectWrapper from './SelectWrapper';
import Style from './Select.module.scss';

const SelectItem: FC<ISelectItem> = ({
  name,
  items,
  searchValue,
  selectHandler,
  isVisibleDisclosure
}) => {
  return (
    <Fragment>
      {items ? (
        <Disclosure as="li" defaultOpen={isVisibleDisclosure}>
          {({ open }) => (
            <Fragment>
              <Disclosure.Button
                as="span"
                className={`${Style.ItemName} ${open ? Style.open : ''}`}
              >
                {TextHighlight(name, searchValue)}
              </Disclosure.Button>
              <Disclosure.Panel
                as="ul"
                className={Style.SubList}
                static={isVisibleDisclosure}
              >
                {items.map(({ id, name, items, visibleItems }) => (
                  <Fragment key={id}>
                    {items ? (
                      <Disclosure as="li" defaultOpen={isVisibleDisclosure}>
                        {({ open }) => (
                          <Fragment>
                            <Disclosure.Button
                              as="span"
                              className={`${Style.ItemName} ${
                                open ? Style.open : ''
                              }`}
                            >
                              {TextHighlight(name, searchValue)}
                            </Disclosure.Button>
                            <Disclosure.Panel
                              as="ul"
                              static={visibleItems}
                              className={Style.SubList}
                            >
                              <SelectWrapper
                                items={items}
                                searchValue={searchValue}
                                selectHandler={selectHandler}
                              />
                            </Disclosure.Panel>
                          </Fragment>
                        )}
                      </Disclosure>
                    ) : (
                      <li
                        onClick={() => selectHandler(name)}
                        className={`${Style.ItemName} ${Style.alone}`}
                      >
                        {TextHighlight(name, searchValue)}
                      </li>
                    )}
                  </Fragment>
                ))}
              </Disclosure.Panel>
            </Fragment>
          )}
        </Disclosure>
      ) : (
        <li
          onClick={() => selectHandler(name)}
          className={`${Style.ItemName} ${Style.alone}`}
        >
          {TextHighlight(name, searchValue)}
        </li>
      )}
    </Fragment>
  );
};

export default SelectItem;
