import { CircleLayer, SymbolLayer } from 'mapbox-gl';

export const companyClusterLayer = {
  id: 'companies',
  source: 'companies',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-radius': 20,
    'circle-color': '#fff',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
} as CircleLayer;

export const companyHoverLayer = {
  id: 'hover',
  source: 'hover',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 30,
    'circle-color': 'rgba(36, 144, 255, 0.25)',
    'circle-stroke-width': 1,
    'circle-stroke-color': 'rgba(36, 144, 255, 0.25)'
  }
} as CircleLayer;

export const companyHoverCenterLayer = {
  id: 'hover-center',
  source: 'hover',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 5,
    'circle-color': '#2490FF',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#2490FF'
  }
} as CircleLayer;

export const companyClusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'companies',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
} as SymbolLayer;

export const companyLayer = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'companies',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': ['get', 'type']
  }
} as SymbolLayer;

export const userLayer = {
  id: 'user-icon',
  type: 'symbol',
  source: 'user',
  layout: {
    'icon-image': ['get', 'type']
  }
} as SymbolLayer;
