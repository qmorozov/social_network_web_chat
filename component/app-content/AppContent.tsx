import React from 'react';

interface IAppContent {
  padding?: 'none' | 'normal' | 'wide';
  id?: string;
  children: React.ReactNode;
}

const AppContent: React.FC<IAppContent> = ({
  children,
  id,
  padding = 'normal'
}) => {
  return (
    <main className={`main-content al-main -pd-${padding}`} id={id}>
      {children}
    </main>
  );
};

export default AppContent;
