import { ApiGroup } from '../../types/api-group';
import { Sender } from './models/Sender';
import { ChatListResponse } from './dto/chat-list.response';
import { PrivateChat } from './dto/private-chat.response';
import { ChatItem } from './models/ChatItem';

export const ChatApi = new (class ChatApi extends ApiGroup {
  async GetChatList(
    businessId: string,
    date?: string,
    takeBefore?: boolean
  ): Promise<ChatListResponse> {
    return (
      (
        await this.get('/Chat/list', {
          params: {
            businessId,
            date,
            takeBefore
          }
        })
      )?.data || {}
    );
  }

  async GetChat(id: string) {
    return (await this.get(`/Chat/${id}`))?.data;
  }
  async GetUser(id: string) {
    return (await this.get(`/User/${id}`))?.data;
  }
  async GroupChatsMembers(chatId: string): Promise<Sender[]> {
    return (await this.get(`/GroupChats/${chatId}/Members`))?.data || [];
  }

  async DeleteGroupChatMember(chatId: string, memberId: string) {
    return await this.delete(`/GroupChats/${chatId}/Members/${memberId}`);
  }

  async PostGroupChats(isFeedChat: string, data: any): Promise<any> {
    return (
      (await this.post(`/GroupChats?isFeedChat=${isFeedChat}`, data)) || []
    );
  }

  async PostPrivateChat(data: PrivateChat): Promise<ChatItem> {
    return ((await this.post(`/Chat`, data)) || []).data; // todo check Vitaliy
  }

  async Link(uri: string) {
    return (
      (
        await this.get(`/Link`, {
          params: {
            uri
          }
        })
      )?.data || []
    );
  }
  async PinChat(id: string): Promise<any> {
    return (await this.put(`/Chat/${id}/pin`))?.data;
  }
  async UnpinChat(id: string): Promise<any> {
    return (await this.put(`/Chat/${id}/unpin`))?.data;
  }
})();
