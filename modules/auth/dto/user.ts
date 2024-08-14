export interface UserDTO {
  id: string;
  name: string | null;
  phone: string;
  email: string;
  description: string;
  website: string;
  defaultAvatarBackground: string;
  chatixId: string;
  settings: {
    isNotificationEnabled: boolean;
    isDarkModeForced: boolean;
    isNewChatsGrouppingEnabled: boolean;
  };
  businesses?: any[];
  photoFileName?: string | null;
  photos?: string[];
  likesCount: number;
  isLiked: boolean;
}
