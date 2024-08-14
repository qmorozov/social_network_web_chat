import { Sender } from './Sender';
import { MessageType } from '@chatix/core-ts';

// export interface Message {
//   content: string;
//   id: string;
//   uuid?: string;
//   sender: Sender;
//   sentAt: number;
//   sentAtFormatted: string;
//   sentAtDate: Date;
//   sentAtTs: number;
//   status: MessageDeliveryStatus;
//   type: MessageType;
//   senderId: string;
// }

export enum MessageDeliveryStatus {
  sent,
  delivered,
  read
}
