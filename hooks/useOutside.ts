import { RefObject, useEffect } from 'react';

export const useOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        ref.current &&
        !ref.current.contains((event?.target as Node) || null)
      ) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
