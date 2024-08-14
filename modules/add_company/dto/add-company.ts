export interface AddCompanyDTO {
  name: string;
  businessCategoryId: string;
  zipCode: string;
  country: string;
  administrativeArea: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  isForSale: boolean;
  schedules: [
    {
      name: string;
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
}
