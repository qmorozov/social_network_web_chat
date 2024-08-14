import { ApiGroup } from '../../types/api-group';

export const OfferAPI = new (class OfferAPI extends ApiGroup {
  async setOfferSubscribe(businessId: string | number) {
    return (
      await this.post('/offer-subscription/subscription', {
        params: {
          locale: businessId
        }
      })
    )?.data;
  }

  async setOfferUnSubscribe(businessId: string | number) {
    return (
      await this.post('/offer-subscription/unsubscription', {
        params: {
          locale: businessId
        }
      })
    )?.data;
  }
})();
