import { ApiGroup } from '../../types/api-group';

export const privacyPolicyAPI = new (class privacyPolicyAPI extends ApiGroup {
  async getPrivacyPolicy(selectedLanguage: string) {
    return (
      await this.get('/Privacy', {
        params: {
          locale: selectedLanguage
        }
      })
    )?.data;
  }
})();
