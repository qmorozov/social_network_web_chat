import { CompanyDTO } from '../../../company/dto/company';

interface IGeojsonData {
  id: string;
  name: string;
  lng: number;
  lat: number;
}

export const generateGeoJSONData = (
  data: IGeojsonData[] | CompanyDTO[],
  type: string
) => ({
  type: 'FeatureCollection',
  features: data.map((item) => {
    return {
      type: 'Feature',
      properties: {
        id: item.id,
        name: item.name,
        type: type,
        lng: item.lng,
        lat: item.lat
      },
      geometry: {
        type: 'Point',
        coordinates: [item.lng, item.lat]
      }
    };
  })
});
