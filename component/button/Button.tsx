import { forwardRef, ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';
import Style from './Button.module.scss';

interface IButton {
  classes?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: boolean;
  title?: string;
}

const Button = forwardRef<HTMLButtonElement, IButton>((props, ref) => {
  const {
    children,
    onClick,
    classes,
    disabled = false,
    type = 'button',
    icon = false,
    title
  } = props;
  const buttonClass = classNames(
    Style.button,
    { [Style.disabled]: disabled },
    { [Style.icon]: icon },
    classes
  );

  return (
    <button
      ref={ref}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
