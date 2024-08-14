import { ApiGroup } from '../../types/api-group';

export const MeApi = new (class MeApi extends ApiGroup {
  async SetName(name: string) {
    return (await this.put('/Me', { name })).data;
  }

  async SetPhoto(Photo: any) {
    return (await this.post('/Me/SetPhoto', Photo)).data;
  }

  async GetCurrentUserInfo() {
    if (!this.accessToken) {
      return undefined;
    }
    try {
      return (await this.get('/Me'))?.data || undefined;
    } catch (err) {
      return undefined;
    }
  }
  async GetUserGeoposition() {
    return (await this.get('/Geoip'))?.data || undefined;
  }
})();
