import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Style from './PageTitle.module.scss';

interface IPageTitle {
  title: string | React.ReactNode;
  children?: React.ReactNode;
  classes?: string;
}

const PageTitle: FC<IPageTitle> = ({ title, children, classes }) => {
  const { t } = useTranslation();
  return (
    <header className={`${Style.wrapper} ${classes ? classes : ''}`}>
      <div className={`${Style.inner}`}>
        {typeof title === 'string' ? (
          <h1 className={Style.title}>{t(`${title}`)}</h1>
        ) : (
          title
        )}
        <div className={Style.items}>{children}</div>
      </div>
    </header>
  );
};

export default PageTitle;
