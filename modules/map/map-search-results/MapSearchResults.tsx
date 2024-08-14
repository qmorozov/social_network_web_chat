import Style from './MapSearchResults.module.scss';
import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import Loader from '../../../component/loader/Loader';
import { CompanyDTO } from '../../company/dto/company';
import MapSearchResultBusinessListItem from './map-search-result-business-list-item/MapSearchResultBusinessListItem';
import { CompanyFilters } from '../map-company-filters/MapCompanyFilters';
import { isWithinInterval } from 'date-fns';

interface IMapSearchResult {
  clusterFilter: Array<string>;
}

const MapSearchResults = ({ clusterFilter }: IMapSearchResult) => {
  const { loading, companyAccountsList } = useTypedSelector(
    (state) => state.companyAccountsList
  );
  const { companiesFilter } = useTypedSelector((state) => state.map);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyDTO[]>([]);

  useEffect(() => {
    if (!loading) {
      const clusterCompanies = companyAccountsList.filter((el) => {
        return clusterFilter.includes(el.id);
      }) as CompanyDTO[];

      setFilteredCompanies(
        clusterFilter.length ? clusterCompanies : companyAccountsList
      );

      switch (companiesFilter) {
        case CompanyFilters.popular:
          setFilteredCompanies((prev) => {
            const prevCopy = [...prev];
            return prevCopy.sort((a, b) => b.likesCount - a.likesCount);
          });
          break;

        case CompanyFilters.closest:
          setFilteredCompanies((prev) => {
            const prevCopy = [...prev];
            return prevCopy.sort(
              (a, b) => a.distanceToCurrentUser! - b.distanceToCurrentUser!
            );
          });

          break;

        case CompanyFilters.openNow:
          setFilteredCompanies((prev) => {
            const prevCopy = [...prev];
            return prevCopy.filter((i) => {
              if (!i.startWork || !i.endWork) return false;
              return isWithinInterval(new Date(Date.now()), {
                start: i.startWork,
                end: i.endWork
              });
            });
          });
          break;
      }
    }
  }, [loading, companiesFilter, clusterFilter, companyAccountsList]);

  if (loading) return <Loader />;

  if (!filteredCompanies.length) return null;

  return (
    <ul className={Style.SearchResults}>
      {filteredCompanies.map((business, index) => (
        <MapSearchResultBusinessListItem
          key={`${business?.id}_${index}`}
          business={business}
        />
      ))}
    </ul>
  );
};

export default MapSearchResults;
