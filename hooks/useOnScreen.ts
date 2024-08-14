import { useEffect, useRef, useState } from 'react';

export const useOnScreen = (
  options = {
    threshold: [1],
    rootMargin: '-173px 0px 0px 0px'
  }
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
    setIsVisible(entries[0].intersectionRatio < 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);

    if (containerRef.current) observer.observe(containerRef?.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef?.current);
    };
  }, [containerRef, options]);

  return { containerRef, isVisible };
};
