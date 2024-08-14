import React, { FC, Fragment } from 'react';
import { ISelectWrapper } from './dto/Select';
import SelectItem from './SelectItem';

const SelectWrapper: FC<ISelectWrapper> = ({
  items,
  searchValue,
  selectHandler
}) => {
  return (
    <Fragment>
      {items.map(({ id, name, items, visibleItems }) => (
        <SelectItem
          key={id}
          name={name}
          items={items}
          searchValue={searchValue}
          selectHandler={selectHandler}
          isVisibleDisclosure={visibleItems}
        />
      ))}
    </Fragment>
  );
};

export default SelectWrapper;
