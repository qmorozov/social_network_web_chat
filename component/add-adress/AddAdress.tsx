import React, { FC, useRef, useEffect, useState } from 'react';
import MapBoxGl, { GeoJSONSource, Marker } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { GeoJsonTypes } from '../../modules/map/map-canvas/Map';
import { generateGeoJSONData } from '../../modules/map/map-canvas/services';
import { userLayer } from '../../modules/map/map-canvas/services/layers';
import customIcons from '../../modules/map/map-canvas/config';
import { MeApi } from '../../modules/me/me.api';
import { PositionSource } from '../../modules/me/store/me';
import Style from './AddAdress.module.scss';
import Icon from '../icon/Icon';

export type AddAdressCallback = {
  country: string | undefined;
  zipCode: string | undefined;
  adress: string | undefined;
  lng: number;
  lat: number;
};
interface IAddAdress {
  getAdress: (obj: AddAdressCallback) => void;
}

enum AdressTypes {
  country = 'country',
  postcode = 'postcode'
}

const AddAdress: FC<IAddAdress> = ({ getAdress }: IAddAdress) => {
  const map = useRef<MapBoxGl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  const { user } = useTypedSelector((state) => state.user);
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const [mapPosition, setMapPosition] = useState<any>({
    lat: 0,
    lng: 0,
    acc: 0,
    updated: false,
    source: null
  });

  const [permision, setPermision] = useState<PermissionState | string>('');

  useEffect(() => {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((res) => setPermision(res.state as PermissionState));
  }, []);

  const userGeojson = generateGeoJSONData(
    [
      {
        id: user?.id!,
        name: user?.name!,
        lat: mapPosition.lat,
        lng: mapPosition.lng
      }
    ],
    GeoJsonTypes.user
  ) as any;

  const userSource = {
    type: 'geojson',
    data: userGeojson
  } as any;

  useEffect(() => {
    if (!mapPosition.updated) {
      const getPosition = async () => {
        const location = await MeApi.GetUserGeoposition();
        map?.current?.setCenter([location.lng, location.lat]);
        setMapPosition((prev: any) => ({
          ...prev,
          lat: location.lat,
          lng: location.lng,
          source: PositionSource.api
        }));
      };

      if (permision === 'granted' || !permision) {
        navigator.geolocation.getCurrentPosition(function (location) {
          if (
            !mapPosition.source ||
            mapPosition.source === PositionSource.api
          ) {
            setMapPosition((prev: any) => ({
              ...prev,
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              acc: location.coords.accuracy,
              source: PositionSource.navigator
            }));
            map?.current?.setCenter([
              location.coords.longitude,
              location.coords.latitude
            ]);
          }
        });
      }
      if (permision === 'prompt' || permision === 'denied') {
        getPosition();
      }
    }
  }, [permision]);

  useEffect(() => {
    if (map.current && mapPosition.source && isSourceLoaded) {
      (map.current.getSource('user') as GeoJSONSource).setData(userGeojson);
    }
  }, [mapPosition.lat, mapPosition.lng, isSourceLoaded]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new MapBoxGl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [mapPosition.lng, mapPosition.lat],
      zoom: 16,
      minZoom: 5,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN
    });

    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN!,
      mapboxgl: map.current as any,
      marker: false
    });

    map.current.addControl(geocoder);

    const getAdressFromAPI = async () => {
      await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          map.current?.getCenter().lng
        },${map.current?.getCenter().lat}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN
        }&types=address`
      )
        .then((data) => data.json())
        .then((res) => {
          const formatData = (res?.features[0]?.context || []).map(
            (data: any) => {
              return {
                ...data,
                id: data.id.split('.')[0]
              };
            }
          );
          const geoposition = {
            zipCode: formatData.find((d: any) => d.id === AdressTypes.postcode)
              ?.text,
            country: formatData.find((d: any) => d.id === AdressTypes.country)
              ?.short_code,
            adress: res?.features[0]?.place_name,
            lng: res?.features[0]?.center[0] || map?.current?.getCenter().lng,
            lat: res?.features[0]?.center[1] || map?.current?.getCenter().lat
          };

          getAdress(geoposition);
        });
    };

    map.current.on('load', async () => {
      if (map.current && map?.current?.loaded()) {
        getAdressFromAPI();
      }

      const marker = new Marker({
        draggable: false
      })
        .setLngLat([mapPosition.lng, mapPosition.lat])
        .addTo(map.current!);

      customIcons.map((icon: any) => {
        const customIcon = new Image(50, 50);
        customIcon.onload = () =>
          map.current && map.current.addImage(icon.name, customIcon);
        customIcon.src = icon.src;
      });

      if (!map.current) return;

      map.current.addSource('user', userSource);

      map.current.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.current.addLayer(userLayer);

      map.current.on('sourcedata', () => {
        if (map.current?.getSource('single-point')) {
          map.current && marker.setLngLat(map.current?.getCenter());
        }
      });

      map.current.on('move', () => {
        map.current && marker.setLngLat(map.current?.getCenter());
      });

      map.current.on('moveend', getAdressFromAPI);

      geocoder.on('result', (event: any) => {
        map.current &&
          (map.current.getSource('single-point') as any).setData(
            event.result.geometry
          );
      });
    });

    map.current.on('sourcedata', () => {
      if (map.current && !!map.current?.getSource('user')) {
        setIsSourceLoaded(true);
      }
    });
  });

  const flyToUserPosition = () => {
    map.current!.flyTo({
      center: [mapPosition.lng, mapPosition.lat],
      essential: true
    });
  };

  return (
    <div className={Style.MapContainer}>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '100%' }}
      />
      {map.current && (
        <div className={Style.ShowMeIcon} onClick={flyToUserPosition}>
          <Icon id="location" />
        </div>
      )}
    </div>
  );
};

export default AddAdress;
