import { ChatItem } from '../models/ChatItem';

export interface ChatListResponse {
  chats: ChatItem[];
  takeBefore: boolean;
  date: string;
  totalItems?: number;
}
