import { useState } from 'react';

export function useDropDown() {
  const [opened, setOpened] = useState(false);

  return {
    opened,
    open: () => setOpened(true),
    close: () => setOpened(false),
    toggle: () => setOpened((s) => !s)
  };
}
