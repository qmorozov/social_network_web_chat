import React, { FC, useEffect, useRef, useState } from 'react';
import { ISelect } from './dto/Select';
import { useOutside } from '../../hooks/useOutside';
import ElementPopper from 'react-element-popper';
import SelectWrapper from './SelectWrapper';
import Icon from '../icon/Icon';
import Style from './Select.module.scss';

const filterList = (searchValue: string, list: any) => {
  const filtered = list.filter((item: any) => {
    const filteredName = item.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const filteredItems = item.items?.some((item: { name: string }) =>
      item.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
    return filteredName | filteredItems;
  });
  return filtered.map((i: any) => {
    const list = { ...i, visibleItems: searchValue.length > 0 };
    if (list.items) {
      const items = list.items.map((li: any) => ({
        ...li,
        visibleItems: searchValue.length > 0
      }));
      return { ...list, items };
    }
    return list;
  });
};

const Select: FC<ISelect> = ({
  open,
  lists,
  search = false,
  onClose,
  children,
  position,
  placeholder,
  classNameBody,
  onOptionSelect,
  setSelectValue,
  optionClass,
  offsetX,
  offsetY
}) => {
  const refBody = useRef(null);
  const ref = useRef<any>(null);
  useOutside(refBody, onClose);
  const [searchInput, setSearchInput] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [isRenderFunction, setIsRenderFunction] = useState(false);

  const findRenderFunction = () => {
    lists.map((item) => setIsRenderFunction(!!item.render));
  };

  useEffect(() => findRenderFunction(), []);

  useEffect(() => {
    open
      ? document.body.classList.add('with-overlay')
      : document.body.classList.remove('with-overlay');
    ref.current && ref.current.refreshPosition();
  }, [open]);

  const target = document.querySelector('#dropdown-portal') as HTMLDivElement;

  useEffect(() => {
    const Debounce = setTimeout(() => {
      const sortedList = filterList(searchInput, lists);
      setFilteredList(sortedList);
    }, 300);
    return () => clearTimeout(Debounce);
  }, [searchInput]);

  const selectHandler = (selectValue: string) => {
    onOptionSelect();
    setSelectValue(selectValue);
  };

  return (
    <ElementPopper
      portal
      ref={ref}
      zIndex={1000000}
      portalTarget={target}
      element={<>{children}</>}
      popper={
        open ? (
          <div
            ref={refBody}
            className={`${Style.wrapper} ${classNameBody ? classNameBody : ''}`}
          >
            {search ? (
              <label className={Style.Input}>
                <input
                  autoFocus
                  type="text"
                  value={searchInput}
                  placeholder={placeholder}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Icon id="search" width={14} height={14} />
              </label>
            ) : null}
            <ul
              className={Style.MainList}
              style={{ padding: `${search ? '0' : '1.25rem'} 0.63rem 1.25rem` }}
            >
              {isRenderFunction ? (
                filteredList.map((item: any) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSelectValue(item);
                      onOptionSelect();
                    }}
                    className={`${Style.Option} ${
                      optionClass ? optionClass : ''
                    }`}
                    title={item.name}
                  >
                    {item.render()}
                  </li>
                ))
              ) : (
                <SelectWrapper
                  items={filteredList}
                  searchValue={searchInput}
                  selectHandler={selectHandler}
                />
              )}
            </ul>
          </div>
        ) : (
          <></>
        )
      }
      popperShadow
      position={position || 'right'}
      offsetX={offsetX}
      offsetY={offsetY}
    />
  );
};

export default Select;
