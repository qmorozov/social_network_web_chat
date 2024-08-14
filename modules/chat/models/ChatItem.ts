import { MessageDeliveryStatus } from './Message';

export interface ChatItem {
  avatarFillColor: string;
  chatixChatroomId: string;
  createdAt: string;
  id: string;
  isPinned: boolean;
  lastMessageContent: string;
  lastMessageId: string;
  lastMessageSenderId: string;
  lastMessageSentAt: string;
  lastMessageSentAtTs: string;
  lastMessageStatus: MessageDeliveryStatus;
  lastMessageType: number;
  membersCount: number;
  name: string;
  photoFileName: string;
  unreadCount: number;
  updatedAt: string;
  partnerId: string;
  partnerVisitorId?: string;
  partnerType: number;
  type: number;
  creatorId: string;
  replyMessage?: any;
}

export enum BusinessChatType {
  private,
  group,
  feed
}
