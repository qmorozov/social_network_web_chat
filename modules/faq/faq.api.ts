import { ApiGroup } from '../../types/api-group';

export const FaqQuestionsApi = new (class FaqApi extends ApiGroup {
  async GetFaqQuestions(selectedLanguage: string) {
    return (
      await this.get('/Faq', {
        params: {
          locale: selectedLanguage
        }
      })
    )?.data;
  }
})();
