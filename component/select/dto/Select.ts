import React from 'react';

export interface ISelect {
  open?: boolean;
  search?: boolean;
  lists: any[];
  onClose: () => void;
  position?: string;
  children?: React.ReactNode;
  placeholder?: string;
  classNameBody?: string;
  optionClass?: string;
  onOptionSelect: () => void;
  setSelectValue: (x: any) => void;
  offsetX?: number;
  offsetY?: number;
}

export interface ISelectWrapper {
  items: any[];
  searchValue: string;
  selectHandler: (name: string) => void;
}

export interface ISelectItem {
  name: string;
  items: any[];
  searchValue: string;
  isVisibleDisclosure: boolean;
  selectHandler: (name: string) => void;
}
