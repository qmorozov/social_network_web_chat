import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { MapSlice } from '../store/map';
import Style from './MapCompanyFilters.module.scss';
import Scrollable from '../../../component/scrollable';

export enum CompanyFilters {
  popular = 'popular',
  closest = 'closest',
  openNow = 'openNow'
}

interface IMapCompanyFilters {
  title: string;
}

const MapCompanyFilters: FC<IMapCompanyFilters> = ({
  title
}: IMapCompanyFilters) => {
  const { t } = useTranslation();

  const { companiesFilter } = useTypedSelector((state) => state.map);
  const { setCompaniesFilter } = useActions(MapSlice);

  const filterHandler = (filter: string) => {
    if (!companiesFilter || companiesFilter !== filter) {
      setCompaniesFilter(filter);
    } else {
      setCompaniesFilter(null);
    }
  };

  const filters = [
    {
      id: CompanyFilters.popular,
      render: () => (
        <a className="pill">{t(`companyFilters.${CompanyFilters.popular}`)}</a>
      )
    },
    {
      id: CompanyFilters.closest,
      render: () => (
        <a className="pill">{t(`companyFilters.${CompanyFilters.closest}`)}</a>
      )
    },
    {
      id: CompanyFilters.openNow,
      render: () => (
        <a className="pill">{t(`companyFilters.${CompanyFilters.openNow}`)}</a>
      )
    }
  ];
  return (
    <>
      <h2 className="sideTitle">{title}:</h2>
      <Scrollable as="ul" classes="filters">
        {filters.map((item) => (
          <li
            key={item.id}
            onClick={() => filterHandler(item.id)}
            className={companiesFilter === item.id ? Style.ActiveFilter : ''}
          >
            {item.render()}
          </li>
        ))}
      </Scrollable>
    </>
  );
};

export default MapCompanyFilters;
