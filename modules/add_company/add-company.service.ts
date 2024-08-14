import { makeService } from '../../services/service';
import { AppState } from '../../services/app-store';
import { AddCompanyApi } from './add-company';
import { ShedulesOrderByType } from '../../component/shedule/Shedule';

export const AddCompanyServiceProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async postBusiness() {
        const newCompany = appState.addCompany;

        const schedules = Object.keys(newCompany.shedule).map((shed) => {
          const getDaysMask = (orderType: number) => {
            const binary = daysWithMask.reduce((acc: any, prev: any) => {
              return acc + (prev.orderType === orderType ? '1' : '0');
            }, '');
            function reverseString(str: string) {
              const splitString = str.split('');
              const reverseArray = splitString.reverse();
              const joinArray = reverseArray.join('');
              return joinArray;
            }
            const digit = parseInt(reverseString(binary), 2);

            return Number(digit);
          };
          const daysWithMask = newCompany.days.map((d, idx) => ({
            ...d,
            mask: idx + 1
          }));

          const shedule = {
            name: shed,
            isWorkingDays: (newCompany.shedule as any)[shed]?.isWorkingDays,
            isRoundTheClock: true,
            daysMask: getDaysMask((ShedulesOrderByType as any)[shed]),
            startHour: (newCompany.shedule as any)[shed].startHour,
            startMinute: (newCompany.shedule as any)[shed].startMinute,
            endHour: (newCompany.shedule as any)[shed].endHour,
            endMinute: (newCompany.shedule as any)[shed].endMinute,
            isDayOffSchedule: !(newCompany.shedule as any)[shed]?.isWorkingDays
          };

          return shedule;
        });

        const filterSchedules = schedules.filter((s) => s.daysMask !== 0);

        const dataView = {
          name: newCompany.name,
          businessCategoryId: newCompany.businessCategory?.id,
          zipCode: newCompany.adress?.zipCode,
          country: newCompany.adress?.country,
          administrativeArea: newCompany.adress?.adress,
          locality: newCompany.adress?.country,
          address: newCompany.adress?.adress,
          lat: newCompany.adress?.lat,
          lng: newCompany.adress?.lng,
          description: '',
          website: '',
          email: newCompany.email,
          phone: '',
          isForSale: true,
          schedules: filterSchedules
        };
        return AddCompanyApi.CreateBusiness(dataView);
      }
    };
  }
);
