import { useEffect, useRef, useState } from 'react';
import MapBoxGl, { GeoJSONSource } from 'mapbox-gl';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { MapSlice } from '../store/map';
import { PositionSource, UserSlice } from '../../me/store/me';
import customIcons from './config';
import { generateGeoJSONData } from './services';
import {
  companyClusterCountLayer,
  companyClusterLayer,
  companyHoverCenterLayer,
  companyHoverLayer,
  companyLayer,
  userLayer
} from './services/layers';
import { MeApi } from '../../me/me.api';
import { useRouter } from 'next/router';

export enum GeoJsonTypes {
  user = 'user',
  business = 'business',
  hover = 'hover'
}

interface IMapView {
  setClusterFilter: (ids: Array<string>) => void;
}

export default function MapView({ setClusterFilter }: IMapView) {
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);
  const [permision, setPermision] = useState<PermissionState | string>('');

  const { updateUserPosition } = useActions(UserSlice);
  const mapPosition = useActions(MapSlice);

  const currentMapPosition = useTypedSelector((state) => state.map);
  const { latitude, longitude, user, positionSource } = useTypedSelector(
    (state) => state.user
  );
  const { companyAccountsList } = useTypedSelector(
    (state) => state.companyAccountsList
  );

  const { query } = useRouter();
  const { lat, lng } = query;

  const { setHoveredCompany } = useActions(MapSlice);
  const { hoveredCompany } = useTypedSelector((state) => state.map);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapBoxGl.Map | null>(null);

  useEffect(() => {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((res) => setPermision(res.state as PermissionState));
  }, []);

  useEffect(() => {
    if (currentMapPosition.showOnMap.show) {
      map?.current?.flyTo({
        center: {
          lat: currentMapPosition.showOnMap.coords.lat,
          lng: currentMapPosition.showOnMap.coords.lng
        },
        essential: false,
        zoom: 18,
        duration: 1000
      });
      mapPosition.setShowOnMap({
        show: false,
        coords: {
          lat: 0,
          lng: 0
        }
      });
    }
  }, [currentMapPosition.showOnMap.show]);

  useEffect(() => {
    if (!currentMapPosition.updated) {
      const getPosition = async () => {
        const location = await MeApi.GetUserGeoposition();
        mapPosition.updateMapPosition({
          latitude: location.lat,
          longitude: location.lng
        });
        updateUserPosition({
          latitude: location.lat,
          longitude: location.lng,
          positionSource: PositionSource.api
        });
        map?.current?.setCenter([
          Number(lng) || location.lng,
          Number(lat) || location.lat
        ]);
      };

      if (permision === 'granted' || !permision) {
        navigator.geolocation.getCurrentPosition(function (location) {
          if (!positionSource || positionSource === PositionSource.api) {
            mapPosition.updateMapPosition({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy
            });
            updateUserPosition({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              positionSource: PositionSource.navigator
            });
            map?.current?.setCenter([
              Number(lng) || location.coords.longitude,
              Number(lat) || location.coords.latitude
            ]);
          }
        });
      }
      if (permision === 'prompt' || permision === 'denied') {
        getPosition();
      }
    }
  }, [permision]);

  const userGeojson = generateGeoJSONData(
    [
      {
        id: user?.id!,
        name: user?.name!,
        lat: latitude,
        lng: longitude
      }
    ],
    GeoJsonTypes.user
  ) as any;

  const companiesGeojson = generateGeoJSONData(
    companyAccountsList,
    GeoJsonTypes.business
  ) as any;

  const hoverGeojson = generateGeoJSONData(
    hoveredCompany
      ? [
          {
            id: 'hover',
            name: 'hover',
            lat: hoveredCompany.lat,
            lng: hoveredCompany.lng
          }
        ]
      : [],
    GeoJsonTypes.hover
  ) as any;

  const userSource = {
    type: 'geojson',
    data: userGeojson
  } as any;

  const companySource = {
    type: 'geojson',
    data: companiesGeojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  } as any;

  const hoverSource = {
    type: 'geojson',
    data: hoverGeojson
  } as any;

  useEffect(() => {
    if (map.current && isSourceLoaded) {
      (map.current.getSource('hover') as GeoJSONSource).setData(hoverGeojson);
    }
  }, [hoveredCompany]);

  useEffect(() => {
    if (map.current && isSourceLoaded) {
      (map.current.getSource('companies') as GeoJSONSource).setData(
        companiesGeojson
      );
    }
  }, [companyAccountsList, isSourceLoaded]);

  useEffect(() => {
    if (map.current && isSourceLoaded) {
      (map.current.getSource('user') as GeoJSONSource).setData(userGeojson);
    }
  }, [latitude, longitude, isSourceLoaded]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new MapBoxGl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [currentMapPosition.longitude, currentMapPosition.latitude],
      zoom: currentMapPosition.zoom || 16,
      minZoom: 5,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN
    });
    map.current.on('load', () => {
      customIcons.map((icon: any) => {
        const customIcon = new Image(50, 50);
        customIcon.onload = () =>
          map.current && map.current.addImage(icon.name, customIcon);
        customIcon.src = icon.src;
      });

      if (map.current) {
        map.current.addSource('hover', hoverSource);

        map.current.addSource('user', userSource);

        map.current.addSource('companies', companySource);

        map.current.addLayer(companyHoverLayer);

        map.current.addLayer(companyHoverCenterLayer);

        map.current.addLayer(companyClusterLayer);

        map.current.addLayer(companyClusterCountLayer);

        map.current.addLayer(companyLayer);

        map.current.addLayer(userLayer);

        if (lat && lng) {
          map?.current?.flyTo({
            center: {
              lat: Number(lat),
              lng: Number(lng)
            },
            essential: false,
            zoom: 18,
            duration: 1000
          });
        }
      }

      setIsSourceLoaded(true);
    });

    map.current.on('click', 'companies', (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['companies']
      });

      if (features.length) {
        const clusterId = features[0].properties!.cluster_id;
        const pointCount = features[0].properties!.point_count;
        const clusterSource = map.current!.getSource('companies') as any;

        clusterSource.getClusterLeaves(
          clusterId,
          pointCount,
          0,
          (error: any, features: any) => {
            if (error) {
              console.error(error);
              return;
            }
            const ids = features.map((f: any) => f.properties.id);
            setClusterFilter(ids);
          }
        );
      }
    });

    map.current.on('click', 'unclustered-point', (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point']
      });
      if (features.length) {
        setClusterFilter(features[0].properties?.id || []);
      }
    });
    map.current.on('mouseenter', 'unclustered-point', (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point']
      });
      if (features.length) {
        setHoveredCompany({
          ...features[0].properties,
          type: 'map'
        });
      }
    });
    map.current.on('mouseleave', 'unclustered-point', (e) => {
      setHoveredCompany(null);
    });

    map.current.on('moveend', () => {
      mapPosition.updateMapPosition({
        latitude: map.current?.getCenter().lat,
        longitude: map.current?.getCenter().lng,
        zoom: map.current?.getZoom()
      });
    });
    map.current.on('mouseenter', 'companies', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'companies', () => {
      map.current!.getCanvas().style.cursor = '';
    });
  });

  return (
    <>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '100%' }}
      />
    </>
  );
}
