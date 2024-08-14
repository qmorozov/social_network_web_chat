import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessChatType, ChatItem } from '../models/ChatItem';
import { ChatListResponse } from '../dto/chat-list.response';

export interface IChatsState {
  loading: boolean;
  page: number;
  hasMore: boolean;
  date: string;
  error: string | null;
  chats: ChatItem[];
  takeBefore: boolean;
  favoriteChats: ChatItem[];
  isShowChats: boolean;
}

export const initialState: IChatsState = {
  loading: false,
  page: 0,
  hasMore: true,
  error: null,
  chats: [],
  favoriteChats: [],
  isShowChats: true,
  date: '',
  takeBefore: false
};

export const ChatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setInLoading(state, action: PayloadAction<number>) {
      state.loading = true;
      state.page = action.payload;
    },

    setIsShowChats(state, { payload }: PayloadAction<boolean>) {
      state.isShowChats = payload;
    },

    setChats(state, { payload }: PayloadAction<ChatListResponse>) {
      state.loading = false;
      state.chats = [...(payload.chats || [])];
      state.date = payload.date;
      state.takeBefore = payload.takeBefore;
      state.hasMore = false;
      state.favoriteChats = [...state.chats.filter((r) => r.isPinned)];
    },

    updateChatList(state, { payload }: PayloadAction<ChatItem[]>) {
      state.chats = [...payload];
    },

    updateChat(state, action: PayloadAction<string>) {
      state.chats = state.chats.map((c) => {
        if (c.id === action.payload) {
          c.isPinned = !c.isPinned;
        }
        return c;
      });
      state.favoriteChats = state.chats.filter((c) => c.isPinned);
    },

    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

const ChatsReducer = ChatsSlice.reducer;

export default ChatsReducer;
