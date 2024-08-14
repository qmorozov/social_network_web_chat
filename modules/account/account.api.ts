import { ApiGroup } from '../../types/api-group';
import { IDescription, IOffer, IResume } from './dto/Account';

export const AccountAPI = new (class accountAPI extends ApiGroup {
  async getCurrency() {
    return (await this.get('/Currency'))?.data;
  }
  async getUnit() {
    return (await this.get('/Unit'))?.data;
  }
  async postResume(data: IResume) {
    return this.post('/Resume', data);
  }

  async deleteResume() {
    return this.delete('/Resume');
  }

  async editResume(data: IResume) {
    return this.put('/Resume', data);
  }

  async postDescription(data: IDescription) {
    return this.put('/Me', data);
  }

  async postDescriptionCompanyById(businessId: string, data: any) {
    return await this.put(`/Business/${businessId}`, data);
  }

  async getResume(userId: string | null = null) {
    return (
      await this.get('/Resume', {
        params: { userId }
      })
    ).data;
  }
  async postOffer(data: IOffer) {
    return this.post('/Offer', data);
  }
  async postOfferAttachment(Attachment: any) {
    return (await this.post('/OfferAttachment', Attachment)).data;
  }
  async deleteOfferAttachment(id: string) {
    await this.delete(`/OfferAttachment/${id}`);
  }
})();
