import { configureStore, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { Action, combineReducers } from 'redux';
import UserReducer, {
  initialState as userInitialState
} from '../modules/me/store/me';
import ChatsReducer, {
  initialState as chatListInitialState
} from '../modules/chat/stores/chat-list.store';
import ActiveChatReducer, {
  initialState as activeChatInitialState
} from '../modules/chat/stores/active-chat.store';
import ChatMembersReducer, {
  initialState as chatMembersInitialState
} from '../modules/chat/stores/chat-members.store';
import CreateChatReducer, {
  initialState as createChatInitialState
} from '../modules/chat/stores/create-chat.store';

import MapReducer from '../modules/map/store/map';
import CategoryListReducer from '../modules/company/store/category-list';
import CompanyAccountsReducer from '../modules/company/store/company-list';
import FaqQuestionsReducer from '../modules/faq/stores/faq.store';
import PrivacyPolicyReducer from '../modules/privacy/store/privacy.store';
import CompanyReducer from '../modules/company/store/company';
import AddCompanyReducer from '../modules/add_company/store/add-company';
import AccountReducer from '../modules/account/store/account.store';
import OfferReducer from '../modules/offer/store/offer.store';
import { LOGOUT } from '../modules/auth/auth.service';
import FeedReducer from '../modules/feed/stores/feed.store';
import VacancieReducer from '../modules/vacancie/stores/vacancie.store';
import ResumeReducer from '../modules/resume/stores/resume.store';

const reducer = {
  user: UserReducer,
  map: MapReducer,
  categoryList: CategoryListReducer,
  chats: ChatsReducer,
  chatMembers: ChatMembersReducer,
  activeChat: ActiveChatReducer,
  createChat: CreateChatReducer,
  faqQuestions: FaqQuestionsReducer,
  privacyPolicy: PrivacyPolicyReducer,
  account: AccountReducer,
  companyAccountsList: CompanyAccountsReducer,
  company: CompanyReducer,
  addCompany: AddCompanyReducer,
  offer: OfferReducer,
  feed: FeedReducer,
  jobs: VacancieReducer,
  resume: ResumeReducer
};

const combinedReducer = combineReducers(reducer);

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });

const rootReducer = (state: any, action: PayloadAction) => {
  if (action.type === LOGOUT) {
    state = {
      ...state,
      user: {
        ...userInitialState,
        latitude: state.user.latitude,
        longitude: state.user.longitude,
        positionSource: state.user.positionSource
      },
      activeChat: activeChatInitialState,
      chats: chatListInitialState,
      chatMembers: chatMembersInitialState,
      createChat: createChatInitialState
    };
  }
  return combinedReducer(state, action);
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export type AppThunkDispatch = ThunkDispatch<AppState, unknown, Action<any>>;

export const useAppDispatch = (): ThunkDispatch<
  AppState,
  unknown,
  Action<any>
> => useDispatch<AppThunkDispatch>();

export const wrapper = createWrapper<AppStore>(makeStore);
