import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ICreateChat {
  isFeedChat: boolean;
  chatName: string;
  memberIds: Array<string>;
}

export const initialState: ICreateChat = {
  isFeedChat: true,
  chatName: '',
  memberIds: []
};

export const CreateChatSlice = createSlice({
  name: 'createChat',
  initialState,
  reducers: {
    setFeedChat(state, { payload }: PayloadAction<any>) {
      state.isFeedChat = payload;
    },
    setMemberIds(state, { payload }: PayloadAction<any>) {
      state.memberIds = payload;
    },
    setChatName(state, { payload }: PayloadAction<any>) {
      state.chatName = payload;
    }
  }
});

const CreateChatReducer = CreateChatSlice.reducer;

export default CreateChatReducer;
