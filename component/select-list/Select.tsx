import React, { FC } from 'react';
import SelectItem from './select-item/SelectItem';

export type SelectItem = {
  id: string;
  content: 'string';
  sublist?: SelectItem[];
  isOpen?: boolean;
  show?: boolean;
};

interface ISelectList {
  items: SelectItem[];
  isOpen?: boolean;
  onOptionSelect: (opt: SelectItem) => void;
  search?: string;
  itemClassName?: string;
  listClassName?: string;
  sublistClassName?: string;
}

const SelectList: FC<ISelectList> = ({
  items,
  isOpen,
  onOptionSelect,
  search,
  itemClassName,
  listClassName,
  sublistClassName
}: ISelectList) => {
  return (
    <>
      <ul className={listClassName}>
        {items.map((i: SelectItem) => (
          <SelectItem
            item={i}
            isOpen={isOpen}
            key={i.id}
            onOptionSelect={onOptionSelect}
            search={search}
            itemClassName={itemClassName}
            sublistClassName={sublistClassName}
          />
        ))}
      </ul>
    </>
  );
};

export default SelectList;
