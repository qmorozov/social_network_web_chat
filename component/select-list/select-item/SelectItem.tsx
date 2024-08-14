import React, { FC, useEffect, useState } from 'react';
import Icon from '../../icon/Icon';
import { TextHighlight } from '../../text-highlight/TextHighlight';
import SelectList, { SelectItem } from '../Select';
import Style from './SelectItem.module.scss';
interface ISelectItem {
  item: SelectItem;
  isOpen?: boolean;
  onOptionSelect: (opt: SelectItem) => void;
  search?: string;
  itemClassName?: string;
  sublistClassName?: string;
}

const SelectItem: FC<ISelectItem> = ({
  item,
  isOpen,
  onOptionSelect,
  search = '',
  itemClassName,
  sublistClassName
}: ISelectItem) => {
  const [selfOpen, setSelfOpen] = useState(isOpen);
  const [openOnce, setOpenOnce] = useState(false);
  const [sublist, setSublist] = useState<SelectItem[] | undefined>(
    item?.sublist
  );

  useEffect(() => {
    setSelfOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setSublist(item?.sublist);
  }, [item]);

  useEffect(() => {
    setOpenOnce(false);
  }, [search]);

  const showItems = (list: SelectItem[]) => {
    const openedList = list.map((l) => ({
      ...l,
      show: true
    }));
    setSublist(openedList);

    if (!openOnce) {
      setSelfOpen(true);
      setOpenOnce(true);
    }
  };

  return (
    <>
      {item?.show ? (
        <li
          className={itemClassName}
          onClick={(e) => {
            e.stopPropagation();
            !item?.sublist && onOptionSelect(item);
            setSelfOpen((prev) => !prev);
            item?.sublist && showItems(item.sublist);
          }}
        >
          <div>
            <span>{TextHighlight(item.content, search || '')}</span>
            {item?.sublist && (
              <div
                className={[Style.Arrow, selfOpen ? Style.OpenItem : ''].join(
                  ' '
                )}
              >
                <Icon id="a-down" />
              </div>
            )}
          </div>
          {sublist && selfOpen && (
            <SelectList
              items={sublist}
              isOpen={selfOpen}
              onOptionSelect={onOptionSelect}
              search={search}
              itemClassName={itemClassName}
              sublistClassName={sublistClassName}
            />
          )}
        </li>
      ) : null}
    </>
  );
};

export default SelectItem;
