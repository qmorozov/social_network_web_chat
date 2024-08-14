import { Sender } from '../models/Sender';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChatMembersState {
  [x: string]: {
    loading: boolean;
    members?: Sender[];
  };
}

export const initialState: IChatMembersState = {};

function stateFor<State extends IChatMembersState, ID extends keyof State>(
  chatId: ID,
  state: State
): State[ID] {
  return state[chatId] || {};
}

function updateChat<State extends IChatMembersState, ID extends keyof State>(
  chatId: ID,
  state: State,
  update: Partial<Record<keyof State[ID], any>>
) {
  return {
    ...state,
    [chatId]: {
      ...stateFor(chatId, state),
      ...update
    }
  };
}

export const ChatMembersSlice = createSlice({
  name: 'chatMembers',
  initialState,
  reducers: {
    setLoading(
      state,
      {
        payload: { chatId, loading = true }
      }: PayloadAction<{ chatId: string; loading?: boolean }>
    ) {
      return updateChat(chatId, state, { loading });
    },
    setMembers(
      state,
      { payload }: PayloadAction<{ chatId: string; members: Sender[] }>
    ) {
      console.warn(payload);
      return updateChat(payload.chatId, state, {
        members: payload.members || [],
        loading: false
      });
    }
  }
});

const ChatMembersReducer = ChatMembersSlice.reducer;

export default ChatMembersReducer;
