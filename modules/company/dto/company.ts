export interface CompanyDTO {
  id: string;
  name: string;
  businessCategoryId: string;
  businessCategory: {
    id: string;
    name: string;
    categoryGroup: {
      id: string;
      name: string;
    };
  };
  zipCode: string;
  country: string;
  administrativeArea: string;
  avatarFillColor: string;
  isUserSubscribedOnBusinessOffers: boolean;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  description: string | null;
  offerSubscriptionCount: number;
  website: string | null;
  email: string | null;
  phone: string | null;
  isForSale: boolean;
  photoFileName: string | undefined;
  offersCount: number;
  likesCount: number;
  isLiked: boolean;
  chatId: string | null;
  photos: any[];
  schedules: [
    {
      name: string;
      orderNumber: number;
      isRoundTheClock: boolean;
      isWorkingDays: boolean;
      startHour: number;
      startMinute: number;
      endHour: number;
      endMinute: number;
      weekdays: number;
      isDayOffSchedule: boolean;
    }
  ];
  offers: IOffer[];
  startWork?: Date | null;
  endWork?: Date | null;
  distanceToCurrentUser?: number | null;
  ownChatId?: string;
  membersCount?: number;
}

export interface IOffer {
  id: string;
  description: string;
  price: number;
  currency: {
    id: string;
    name: string;
    symbol: string;
    code: string;
  };
  unit: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  zipCode: string;
  country: string;
  administrativeArea: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  likes: number;
  isLiked: boolean;
  attachments: [
    {
      id: string;
      url: string;
    }
  ];
}

export interface IMember {
  id: string;
  user: {
    id: string;
    name: string;
    defaultAvatarBackground: string;
    isOnline: boolean;
    chatId: string;
    photoFileName: string;
    photos: [
      {
        id: string;
        photoFileName: string;
      }
    ];
    type: number;
    likesCount: number;
    isLiked: boolean;
  };
}
