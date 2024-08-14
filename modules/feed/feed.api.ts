import { ApiGroup } from '../../types/api-group';

export const FeedApi = new (class FeedApi extends ApiGroup {
  async getOfferBusinesses() {
    return (await this.get('/offer-subscription/businesses'))?.data;
  }

  async putUnsubscribe(businessId: string) {
    await this.put(`/offer-subscription/unsubscribe?businessId=${businessId}`);
  }
  async postSubscribe(businessId: string) {
    await this.post(`/offer-subscription/subscribe?businessId=${businessId}`);
  }
  async getOfferSubscription(
    page: string | number = 1,
    pageSize: string | number = 50
  ) {
    return (
      await this.get('/offer-subscription/offers', {
        params: { page, pageSize }
      })
    )?.data;
  }
})();
