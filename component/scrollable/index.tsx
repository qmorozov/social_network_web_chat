import {
  FC,
  useRef,
  ReactNode,
  createElement,
  useEffect,
  CSSProperties
} from 'react';

interface IScrollableProps {
  classes?: string;
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  style?: CSSProperties;
}

const Scrollable: FC<IScrollableProps> = ({
  classes,
  as = 'div',
  children,
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = wrapperRef.current;

    if (element) {
      let startX = 0;
      let scrollLeft = 0;

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        element.scrollTo({
          left: element.scrollLeft + event.deltaY,
          behavior: 'smooth'
        });
      };

      const onMouseDown = (event: MouseEvent) => {
        startX = event.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        element.classList.add('active');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (event: MouseEvent) => {
        const x = event.pageX - element.offsetLeft;
        const walk = (x - startX) * 3;
        element.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        element.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      element.addEventListener('mousedown', onMouseDown);
      element.addEventListener('wheel', onWheel);

      return () => {
        element.removeEventListener('mousedown', onMouseDown);
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseup', onMouseUp);
        element.removeEventListener('wheel', onWheel);
      };
    }
  }, [wrapperRef]);

  return createElement(
    as,
    {
      ref: wrapperRef,
      className: classes,
      style: style
    },
    children
  );
};

export default Scrollable;
