import { ChangeEventHandler, forwardRef, useRef, EventHandler } from 'react';
import Style from './Textarea.module.scss';

interface ITextarea {
  onChange?: ChangeEventHandler;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  classes?: string;
  value?: any;
  readonly?: boolean;
  name?: string;
  onBlur?: EventHandler<any>;
  onFocus?: EventHandler<any>;
}

const Textarea = forwardRef<HTMLTextAreaElement, ITextarea>(
  (
    {
      onChange,
      placeholder,
      autoFocus,
      required,
      classes,
      readonly = false,
      value,
      name,
      onBlur,
      onFocus
    },
    ref
  ) => {
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const textareaInputHandler = () => {
      if (textarea.current) {
        textarea.current.style.height = '32px';
        textarea.current.style.height = `${Math.min(
          textarea.current.scrollHeight,
          148
        )}px`;
      }
    };
    return (
      <label className={`form-control ${classes ? classes : ''}`}>
        <textarea
          className={`control -single ${Style.textarea}`}
          onChange={onChange}
          ref={ref}
          name={name}
          value={value}
          readOnly={readonly}
          onInput={textareaInputHandler}
          placeholder={placeholder}
          autoFocus={autoFocus}
          required={required}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </label>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
