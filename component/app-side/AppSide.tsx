import React from 'react';

interface IAppSide {
  children?: React.ReactNode;
  type: 'left' | 'right';
  className?: string;
  id?: string;
}

const AppSide: React.FC<IAppSide> = ({ children, type, className, id }) => {
  return (
    <aside className={`al-side -${type} ${className ? className : ''}`}>
      <div className="al-side-content" id={id}>
        {children}
      </div>
    </aside>
  );
};

export default AppSide;
