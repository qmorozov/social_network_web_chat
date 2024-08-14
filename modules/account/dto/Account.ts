export interface ICurrency {
  id: string;
  name: string;
  symbol: string;
  code: string;
}

export interface IUnit {
  id: string;
  name: string;
}

export interface IAttachments {
  id: string;
  url: string;
}

export interface IResume {
  title: string;
  description: string;
  salaryFrom: number | null;
  salaryTo: number | null;
  currencyId: string;
  address: string | undefined;
  lat: number;
  lng: number;
}

export interface IOffer {
  description: string;
  price: number;
  currencyId: string;
  unitId: string;
  categoryId: string;
  zipCode: string;
  country: string;
  administrativeArea: string;
  locality: string;
  address: string | undefined;
  lat: number;
  lng: number;
  businessId: string | null;
}

export interface IDescription {
  description?: string;
  website?: string;
  email?: string;
  name?: string | null;
}

export enum DescriptionTypes {
  description = 'description',
  website = 'website',
  email = 'email',
  name = 'name'
}
