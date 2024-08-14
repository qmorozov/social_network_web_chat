import React, { FC } from 'react';
import Link from 'next/link';
import Style from './Breadcrumbs.module.scss';
import { useTranslation } from 'react-i18next';

interface IBreadcrumbs {
  crumbs: any[];
}

const Breadcrumbs: FC<IBreadcrumbs> = ({ crumbs }) => {
  const { t } = useTranslation();
  const currentPage = (index: number) => index === crumbs.length - 1;

  return (
    <div className={Style.wrapper}>
      <ul className={Style.breadcrumbs}>
        {crumbs.map((crumb, index) => (
          <li
            key={`${crumb.title}_${index}`}
            className={`${Style.crumbs} ${
              currentPage(index) ? `${Style.current}` : ''
            }`}
          >
            <Link href={crumb.route}>{t(crumb.title)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
