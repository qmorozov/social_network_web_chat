import { Dispatch, SetStateAction, useState } from 'react';

export type FileSelectHandler = {
  selected: File[];
  setSelected: Dispatch<SetStateAction<FileSelectHandler['selected'] | any>>;
};

export function useFileSelect(
  onChange?: (files: FileSelectHandler['selected']) => any | void
): FileSelectHandler {
  const [selected, setSelected] = useState<FileSelectHandler['selected']>([]);

  return {
    selected,
    setSelected
  };
}
