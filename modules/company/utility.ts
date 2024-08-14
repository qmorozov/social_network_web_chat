import { isWeekend } from 'date-fns';
import { ShedulesOrderByType } from '../../component/shedule/Shedule';
import { CompanyDTO } from './dto/company';

type userCoordinates = {
  lat: number;
  lng: number;
};

const getDistanceToUser = (
  company: CompanyDTO,
  userCoordinates: userCoordinates
) => {
  const unit = 'K';
  if (
    company.lat == userCoordinates.lat &&
    company.lng == userCoordinates.lng
  ) {
    return 0;
  } else {
    const radlat1 = (Math.PI * company.lat) / 180;
    const radlat2 = (Math.PI * userCoordinates.lat) / 180;
    const theta = company.lng - userCoordinates.lng;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }

    return dist;
  }
};

const addFilterFilelds = (
  companies: CompanyDTO[],
  userCoordinates: userCoordinates
) => {
  const date = Date.now();
  return companies.map((company) => {
    const workDaysShedule = company.schedules.find(
      (s) => s.orderNumber === ShedulesOrderByType.workDays
    );
    const weekendShedule = company.schedules.find(
      (s) => s.orderNumber === ShedulesOrderByType.weekends
    );
    const isWeekendToday = isWeekend(date);

    const isWorkingDays = company.schedules.find(
      (shedule) =>
        shedule.orderNumber ===
        (isWeekendToday
          ? ShedulesOrderByType.weekends
          : ShedulesOrderByType.workDays)
    )?.isWorkingDays;

    const todayShedule = isWorkingDays ? workDaysShedule : weekendShedule;

    if (!todayShedule) return null;

    const startWork = new Date();
    startWork.setHours(todayShedule.startHour);
    startWork.setMinutes(todayShedule.startMinute);

    const endWork = new Date();
    endWork.setHours(todayShedule.endHour);
    endWork.setMinutes(todayShedule.endMinute);

    const distanceToCurrentUser = getDistanceToUser(company, userCoordinates);

    return {
      ...company,
      startWork,
      endWork,
      distanceToCurrentUser
    };
  });
};

export default addFilterFilelds;
