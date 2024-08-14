import { makeService } from '../../services/service';
import { ChatsSlice } from './stores/chat-list.store';
import { ChatApi } from './chat.api';
import { AppState } from '../../services/app-store';
import { ChatMembersSlice } from './stores/chat-members.store';
import { ActiveChatSlice } from './stores/active-chat.store';
import { BusinessChatType, ChatItem } from './models/ChatItem';
import { Sender } from './models/Sender';
import { ChatixService } from '../chatix/chatix.service';
import { CompositeLinkAttachment } from '@chatix/core-ts/dist/esm/types';
import { PrivateChat } from './dto/private-chat.response';

export const ChatServiceProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    const chatListState = appState.chats;
    const chatMembersState = appState.chatMembers;
    const activeChatState = appState.activeChat;
    const createChatState = appState.createChat;

    return {
      async postGroupChats() {
        const isFeedChat = createChatState.isFeedChat;
        const data = {
          chatName: createChatState.chatName,
          memberIds: createChatState.memberIds,
          type: 0
        };
        (await ChatApi.PostGroupChats(String(isFeedChat), data)) || [];
      },

      async getList(businessId: string, date?: string, takeBefore?: boolean) {
        if (!chatListState.loading && (!chatListState.chats.length || date)) {
          try {
            const chats = await ChatApi.GetChatList(
              businessId,
              date,
              takeBefore
            );

            const userChatData: PrivateChat = {
              partnerId: appState.user.user?.id!,
              currentUserBusinessId: null,
              partnerType: 0
            };

            const userChat = await ChatApi.PostPrivateChat(userChatData);

            if (!chats.chats.find((c) => c.id === userChat.id)) {
              chats.chats.push(userChat);
            }

            dispatch(ChatsSlice.actions.setChats(chats));
          } catch (e) {
            dispatch(ChatsSlice.actions.setError((e as Error).message));
          }
        }
      },

      async getListNext(businessId: string, date: string, takeBefore: boolean) {
        return this.getList(businessId, date, takeBefore);
      },

      async loadChatMembers(chatId: string) {
        if (!chatMembersState?.[chatId]?.loading) {
          dispatch(
            ChatMembersSlice.actions.setLoading({ chatId, loading: true })
          );
          return ChatApi.GroupChatsMembers(chatId)
            .catch(() => [])
            .then((members) => {
              const newMembers = members.map(async (m) => {
                return {
                  ...m,
                  ownChatId: await ChatApi.GetUser(m.id).then(
                    (res) => res.chatId
                  )
                };
              });
              Promise.all(newMembers).then((res) => {
                return dispatch(
                  ChatMembersSlice.actions.setMembers({
                    chatId,
                    members: res
                  })
                );
              });
            });
        }
      },

      async loadActiveChatInfo(chatId?: string): Promise<ChatItem | undefined> {
        if (!chatId) {
          return undefined;
        }
        const chatInfo = (chatListState.chats || []).find(
          (c) => c.id === chatId
        );

        // console.log('chatService - ChatId =', chatId);
        // ChatApi.GetChat(chatId).then((resp) =>
        //   console.log('chatService - ChatApi.GetChat = ', resp)
        // );
        // console.log('chatService - chatInfo = ', chatInfo);
        return chatInfo || ChatApi.GetChat(chatId);
      },

      async loadActiveChatMembers(
        chatId?: string,
        info?: ChatItem
      ): Promise<Sender[] | undefined> {
        if (!chatId) {
          return undefined;
        }

        if (info) {
          if (info?.type !== BusinessChatType.group) {
            return [];
          }
        }

        const localMembers = chatMembersState?.[chatId];

        if (localMembers?.members) {
          return localMembers?.members || [];
        }

        const members = await ChatApi.GroupChatsMembers(chatId);

        if (info?.type === BusinessChatType.group) {
          dispatch(
            ChatMembersSlice.actions.setMembers({
              chatId: chatId as string,
              members: members as Sender[]
            })
          );
        }

        return members;
      },

      async deleteGroupChatMember(chatId: string, memberId: string) {
        // dispatch(ActiveChatSlice.actions.setGroupChatMembers);
        await ChatApi.DeleteGroupChatMember(chatId, memberId);
      },

      async clearActiveChat() {
        dispatch(ActiveChatSlice.actions.resetActiveChat());
      },

      async setActiveChat(chatId?: string) {
        if (chatId !== activeChatState.id) {
          dispatch(ActiveChatSlice.actions.setActiveChat({ id: chatId }));
          const info = await this.loadActiveChatInfo(chatId);
          const members = await this.loadActiveChatMembers(chatId, info);

          dispatch(
            ActiveChatSlice.actions.setActiveChatInfo({ info, members })
          );
        }
      },

      scrollChatToEnd() {
        return setTimeout(() => {
          const chatList = document.getElementById('chat-messages-list');
          if (chatList) {
            chatList.scrollTo(0, chatList.scrollHeight);
          }
        });
      },

      async loadChatHistory(chatId: string) {
        return ChatixService.GetHistory(chatId)
          .then((res) => {
            dispatch(
              ActiveChatSlice.actions.setActiveChatMessages({
                messages: JSON.parse(JSON.stringify(res?.messages || []))
              })
            );
          })
          .catch((res) => {
            console.warn('ChatixService.GetHistory', res);
          });
      },

      async linkInfo(uri: string) {
        return ChatApi.Link(uri).catch(() => undefined);
      },

      async getLinkFromText(
        messageText?: string | null
      ): Promise<CompositeLinkAttachment | undefined> {
        if (!messageText) {
          return;
        }
        const matches = messageText.match(/\bhttps?:\/\/\S+/gi);
        const link = matches?.[0];

        if (link) {
          return this.linkInfo(link);
        }

        return;
      },

      async sendMessage(
        chatId: string,
        text?: string | null,
        files?: File[],
        replyMessageId?: string
      ) {
        const replyMessage = activeChatState.replyMessageInfo?.message;
        const link = await this.getLinkFromText(text);

        return ChatixService.SendMessage(
          chatId,
          text,
          link,
          files,
          replyMessageId,
          appState?.user?.selectedCompany || null
        )

          .then((res) => {
            console.log(res);

            const message = JSON.parse(JSON.stringify(res)) as ChatItem;
            if (replyMessage) {
              message.replyMessage = replyMessage;
            }
            dispatch(ActiveChatSlice.actions.addMessage(message));
          })
          .catch((err) => {
            console.log(err);
          });
      },

      forwardMessage(message: string, chatixChatroomId: string) {
        return ChatixService.ForwardMessage(message, chatixChatroomId);
      },

      async setReplyMessageInfo(messageInfo: any) {
        dispatch(ActiveChatSlice.actions.setReplyMessageInfo(messageInfo));
      }
    };
  }
);
