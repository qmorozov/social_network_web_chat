import { ApiGroup } from '../../types/api-group';
import { removeDuplicates } from '../helper';

interface ISearch {
  query: string;
}

export interface IBusiness {
  latlng: string;
  radius: number;
  categoryId?: string | null;
  categoryGroupId?: string | null;
  query?: string;
  lat?: number;
  lng?: number;
  userCoordinates?: {
    lat: number;
    lng: number;
  };
}
export const BusinessApi = new (class BusinessApi extends ApiGroup {
  async GetCategoryList(selectedLanguage: string) {
    return (
      await this.get('/BusinessCategory', {
        params: {
          locale: selectedLanguage
        }
      })
    )?.data;
  }
  async GetInputSearchResult({ query }: ISearch) {
    return (
      await this.get('/BusinessSearchSuggestions', {
        params: {
          query
        }
      })
    )?.data;
  }
  async GetInputSearchHistory() {
    return (await this.get('/BusinessSearchHistories'))?.data;
  }
  async GetBusinessAccounts({
    latlng,
    radius,
    categoryId,
    categoryGroupId,
    query
  }: IBusiness) {
    const defaultResponse: {
      businesses: any[];
      jobs: any[] | null;
      offers: any[] | null;
      resumes: any[] | null;
    } = {
      businesses: [],
      jobs: [],
      offers: [],
      resumes: []
    };
    const mapItems: typeof defaultResponse =
      (
        await this.get('/Business', {
          params: {
            latlng,
            radius,
            categoryId: categoryId || '',
            categoryGroupId: categoryGroupId || '',
            query: query || ''
          }
        }).catch(() => ({ data: defaultResponse }))
      )?.data || defaultResponse;

    Object.keys(defaultResponse).forEach((k) => {
      mapItems[k as keyof typeof mapItems] = removeDuplicates(
        mapItems[k as keyof typeof mapItems] || []
      );
    });

    if (mapItems?.businesses?.length) {
      mapItems.businesses = mapItems.businesses.map((li: any) => {
        li.offers = removeDuplicates(li?.offers || []);
        return li;
      });
    }

    return mapItems;
  }
  async getCompanyMembers(businessId: string) {
    return (await this.get(`/BusinessAccountMember/${businessId}`))?.data;
  }
  async getCompanyById(businessId: string | number) {
    return (await this.get(`/Business/${businessId}`))?.data;
  }
  async deleteCompanyById(businessId: string | number) {
    return await this.delete(`/Business/${businessId}`);
  }
  async getCompanyOffers(businessId: string | null, userId?: string | null) {
    return (
      await this.get('/Offer', {
        params: {
          businessId,
          userId
        }
      })
    )?.data;
  }
  async GetUserOffer(offerId: string) {
    return (await this.get(`/Offer/My/${offerId}`))?.data;
  }
  async GetOfferInfo(offerId: string) {
    return (await this.get(`/Offer/${offerId}`))?.data;
  }
  async likeOffer(offerId: string) {
    return (await this.post(`/Offer/${offerId}/Like`))?.data;
  }
  async unlikeOffer(offerId: string) {
    return (await this.post(`/Offer/${offerId}/Unlike`))?.data;
  }
  async SetPhoto(Photo: any, id: string) {
    return (await this.post(`/Business/${id}/SetPhoto`, Photo)).data;
  }

  async PostLikeBusiness(businessId: string): Promise<any> {
    return (await this.post(`/Business/${businessId}/Like`)) || [];
  }

  async PostUnLikeBusiness(businessId: string): Promise<any> {
    return (await this.post(`/Business/${businessId}/Unlike`)) || [];
  }
})();
