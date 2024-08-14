import React, { useImperativeHandle, forwardRef, useState } from 'react';
import Style from './Snackbar.module.scss';

export enum SnackbarType {
  success = 'success',
  fail = 'fail'
}

export const Snackbar = forwardRef<any, any>((props, ref) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  useImperativeHandle(ref, () => ({
    show() {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    }
  }));

  const isSuccess = props.type === SnackbarType.success;

  return (
    <div
      className={`${Style.snackbar} ${
        showSnackbar ? Style.SnackbarShow : Style.SnackbarHide
      }`}
      style={{
        backgroundColor: isSuccess ? '#00F593' : '#FF0033',
        color: isSuccess ? 'black' : 'white'
      }}
    >
      <div className={Style.symbol}>
        {isSuccess ? <h1>&#x2713;</h1> : <h1>&#x2613;</h1>}
      </div>
      <div className={Style.message}>{props.message}</div>
    </div>
  );
});

Snackbar.displayName = 'Snackbar';

export default Snackbar;
