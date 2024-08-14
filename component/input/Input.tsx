import { forwardRef, InputHTMLAttributes, EventHandler } from 'react';
import Icon from '../icon/Icon';
import Style from './Input.module.scss';

enum InputType {
  file = 'file',
  text = 'text',
  number = 'number',
  checkbox = 'checkbox'
}

type InputTypeString = keyof typeof InputType;

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  type?: InputTypeString;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  classes?: string;
  defaultValue?: string | number;
  select?: boolean;
  readonly?: boolean;
  openSelect?: boolean;
  onClick?: () => void;
  lastInput?: boolean;
  onBlur?: EventHandler<any>;
  onFocus?: EventHandler<any>;
}

const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  const {
    type,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    name,
    required,
    autoFocus,
    classes,
    select,
    readonly,
    openSelect,
    value,
    onClick,
    defaultValue = '',
    lastInput
  } = props;
  const customClass = classes ? classes : '';
  return (
    <>
      {!select && type === 'checkbox' ? (
        <label className={`${Style.checkbox} ${customClass}`}>
          <input
            ref={ref}
            type={type}
            onClick={onClick}
            onChange={onChange}
            required={required}
            readOnly={readonly}
            autoFocus={autoFocus}
          />
          <span className={Style.checkboxFake}></span>
          {placeholder ? <p>{placeholder}</p> : null}
        </label>
      ) : null}
      {!select && type !== 'checkbox' ? (
        <label
          className={`form-control ${Style.input} ${customClass} ${
            lastInput ? 'lastInput' : ''
          }`}
        >
          <input
            ref={ref}
            type={type}
            value={value}
            onClick={onClick}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            name={name}
            required={required}
            readOnly={readonly}
            autoFocus={autoFocus}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={`control -single`}
          />
        </label>
      ) : null}
      {select ? (
        <label
          className={`form-control ${Style.input} ${Style.select} ${
            openSelect ? Style.openSelect : ''
          } ${lastInput ? 'lastInput' : ''}`}
        >
          <input
            ref={ref}
            type={type}
            onClick={onClick}
            onChange={onChange}
            readOnly={readonly}
            value={value}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={`control -single`}
          />
          <Icon id="a-down" width={7} height={6} />
        </label>
      ) : null}
    </>
  );
});

Input.displayName = 'Input';

export default Input;
