import React from 'react';
import { createPortal } from 'react-dom';

interface IWithBackdrop {
  children: React.ReactNode;
  onClick?: () => any;
}

const WithBackdrop: React.FC<IWithBackdrop> = ({ children, onClick }) => (
  <>
    {children && <div className="app-backdrop-content">{children}</div>}

    {createPortal(
      <div className="app-backdrop" onClick={() => onClick?.()}></div>,
      document.querySelector('#portal')!
    )}
  </>
);

export default WithBackdrop;
