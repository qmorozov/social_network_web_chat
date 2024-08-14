import React, { useEffect, useState } from 'react';
import AppSide from '../../component/app-side/AppSide';
import AppContent from '../../component/app-content/AppContent';
import MapCategoryList from './map-category-list/MapCategoryList';
import MapSearchResults from './map-search-results/MapSearchResults';
import MapView from './map-canvas/Map';
import MapSearchInput from './map-search-input/MapSearchInput';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useService } from '../../hooks/useService';
import { CompanyAccountsListProvider } from '../company/services/company-list.service';
import MapCompanyFilters from './map-company-filters/MapCompanyFilters';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const MapPage = () => {
  const { t } = useTranslation();
  const {
    latitude,
    longitude,
    selectedCategoryGroupId,
    selectedCategoryId,
    zoom
  } = useTypedSelector((state) => state.map);

  const { lat, lng } = useTypedSelector((state) => state.companyAccountsList);
  const { latitude: userLat, longitude: userLng } = useTypedSelector(
    (state) => state.user
  );

  const { getBusinessAccountsList } = useService(CompanyAccountsListProvider);

  const [clusterFilter, setClusterFilter] = useState<Array<string>>([]);
  const [query, setQuery] = useState<string>('');

  const [updated, setUpdated] = useState(false);

  const getLatRadius = (lat: number): number => {
    if (lat >= 0 && lat < 10) {
      return 78271.484;
    }
    if (lat >= 10 && lat < 30) {
      return 73551.136;
    }
    if (lat >= 30 && lat < 50) {
      return 78271.484;
    }
    if (lat >= 50 && lat < 70) {
      return 39135.742;
    }
    return 13591.701;
  };

  const radius = Math.round((getLatRadius(latitude) / 2 ** (zoom! + 1)) * 1000);

  const { query: routerQuery } = useRouter();
  const { categoryId } = routerQuery;

  useEffect(() => {
    if (categoryId) {
      getBusinessAccountsList({
        radius,
        latlng: [latitude, longitude].join(','),
        categoryGroupId: selectedCategoryGroupId,
        categoryId: selectedCategoryId,
        query,
        lat: latitude,
        lng: longitude,
        userCoordinates: {
          lat: userLat,
          lng: userLng
        }
      });
      setClusterFilter([]);
    }
  }, []);

  useEffect(() => {
    if ((lat !== latitude && lng !== longitude) || updated) {
      getBusinessAccountsList({
        radius,
        latlng: [latitude, longitude].join(','),
        categoryGroupId: selectedCategoryGroupId,
        categoryId: selectedCategoryId,
        query,
        lat: latitude,
        lng: longitude,
        userCoordinates: {
          lat: userLat,
          lng: userLng
        }
      });
      setClusterFilter([]);
    }
    setUpdated(true);
  }, [latitude, longitude, selectedCategoryId, selectedCategoryGroupId, query]);

  return (
    <>
      <AppSide type="left" className="no-border">
        <div className="content -static">
          <h2 className="sideTitle">Categories:</h2>
        </div>

        <div className="content -scroll">
          <MapCategoryList />
        </div>
      </AppSide>
      <AppContent padding="none">
        <MapSearchInput setQuery={setQuery} />
        <MapView setClusterFilter={setClusterFilter} />
      </AppContent>
      <AppSide type="right" className="no-border">
        <div className="content -static">
          <MapCompanyFilters title={t('companyFilters.whatsAround')} />
        </div>

        <div className="content -scroll px-0">
          <MapSearchResults clusterFilter={clusterFilter} />
        </div>
      </AppSide>
    </>
  );
};

export default MapPage;
