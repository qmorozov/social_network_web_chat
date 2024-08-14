export interface Sender {
  chatId: string;
  defaultAvatarBackground: string;
  id: string;
  isLiked: boolean;
  isOnline: boolean;
  likesCount: number;
  name: string;
  photoFileName: string;
  photos: ProfilePhoto[];
  type: ProfileType;
  ownChatId?: string;
  sender_Id: string;
  description: null | string;
  email: null | string;
  website: null | string;
}

export interface ProfilePhoto {
  id: string;
  photoFileName: string;
}

export enum ProfileType {
  user,
  business
}
