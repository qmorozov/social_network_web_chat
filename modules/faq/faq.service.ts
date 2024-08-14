import { makeService } from '../../services/service';
import { FaqQuestionsSlice } from './stores/faq.store';
import { FaqQuestionsApi } from './faq.api';
import { AppState } from '../../services/app-store';

export const FaqProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getFaqQuestions(selectedLanguage: string) {
        dispatch(FaqQuestionsSlice.actions.setLoading(true));
        try {
          const faq = await FaqQuestionsApi.GetFaqQuestions(selectedLanguage);
          dispatch(
            FaqQuestionsSlice.actions.setFaq({
              faqQuestions: faq,
              language: selectedLanguage
            })
          );
        } catch (e) {
          // todo page show error
        } finally {
          dispatch(FaqQuestionsSlice.actions.setLoading(false));
        }
      }
    };
  }
);
