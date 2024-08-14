import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItem } from '../models/ChatItem';
import { Sender } from '../models/Sender';
import { startOfDay } from 'date-fns';
import { removeDuplicates } from '../../helper';

interface IMessagesByDate {
  date: number;
  messages: any[];
}

export interface IChatMembersState {
  id?: string;
  loading: boolean;
  info?: ChatItem;
  members?: Sender[];
  messages?: any[];
  messagesByDate?: IMessagesByDate[];
  hasMore: boolean;
  replyMessageInfo?: any;
}

export const initialState: IChatMembersState = {
  loading: false,
  hasMore: true,
  replyMessageInfo: {}
};

function addMessagesToState(state: IChatMembersState, messages: any[]) {
  state.messages = removeDuplicates(
    [...(state.messages || []), ...(messages || [])] as any[],
    'uuid'
  );

  const messagesByDate = state.messages.reduce((acc, current) => {
    const day = startOfDay(
      new Date(current.sentAt)
    ).getTime() as keyof typeof acc;

    ((acc[day] = acc[day] || []) as any[]).push(current);
    return acc;
  }, {}) as Record<number, any[]>;

  state.messagesByDate = Object.entries(messagesByDate)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([date, messages]): IMessagesByDate => {
      return {
        date: Number(date),
        messages: (messages || []).sort((a, b) => a.sentAt - b.sentAt)
      };
    });

  return state;
}

export const ActiveChatSlice = createSlice({
  name: 'activeChat',
  initialState,
  reducers: {
    setActiveChat(
      state,
      { payload }: PayloadAction<Pick<IChatMembersState, 'id'>>
    ) {
      state.id = payload.id;
      state.loading = true;
      state.messages = undefined;
    },

    resetActiveChat(state) {
      state.id = undefined;
      state.loading = false;
      state.info = undefined;
      state.members = undefined;
      state.messages = undefined;
      state.messagesByDate = undefined;
      state.hasMore = true;
    },

    setActiveChatInfo(
      state,
      { payload }: PayloadAction<Pick<IChatMembersState, 'info' | 'members'>>
    ) {
      state.info = payload.info || undefined;
      state.members = payload.members || [];
      state.loading = false;
    },

    setActiveChatMessages(
      state,
      { payload }: PayloadAction<Partial<IChatMembersState>>
    ) {
      return addMessagesToState(state, payload?.messages || []);
    },

    addMessage(state, { payload }: PayloadAction<any>) {
      return addMessagesToState(state, [payload]);
    },

    setActiveChatReadMessages(state) {
      const newInfo = { ...state.info, unreadCount: 0 } as ChatItem;
      state.info = newInfo;
    },

    setGroupChatMembers(state, { payload }: PayloadAction<any>) {
      console.log(state);
    },

    setReplyMessageInfo(state, { payload }: PayloadAction<any>) {
      state.replyMessageInfo = payload;
    }
  }
});

const ActiveChatReducer = ActiveChatSlice.reducer;

export default ActiveChatReducer;
