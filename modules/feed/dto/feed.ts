import { IOffer } from '../../company/dto/company';

export interface OfferBusinessesnDTO {
  id: string;
  name: string;
}

export interface OffersDTO {
  offer: IOffer;
  businessId: string;
  businessName: string;
  businessBackgroundColor: string;
  businessImageUrl: string;
}
