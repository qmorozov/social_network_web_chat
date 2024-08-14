import { makeService } from '../../../services/service';
import { CategoryListSlice } from '../store/category-list';
import { AppState } from '../../../services/app-store';
import { ChatApi } from '../../chat/chat.api';
import { PrivateChat } from '../../chat/dto/private-chat.response';

export const CompanyChatProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const user = appState.user.user;
    const company = appState.user.selectedCompany;

    return {
      async postChat(companyId: string | null, goChatId: (id: string) => void) {
        dispatch(CategoryListSlice.actions.setLoading(true));
        try {
          const data: PrivateChat = {
            partnerId: user?.id!,
            currentUserBusinessId: companyId,
            partnerType: 0
          };

          const result = await ChatApi.PostPrivateChat(data);

          goChatId(result.id);
        } catch (e) {
          console.log(e);
        } finally {
          dispatch(CategoryListSlice.actions.setLoading(false));
        }
      }
    };
  }
);
