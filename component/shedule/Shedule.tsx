import React, { FC } from 'react';
import { CompanyDTO } from '../../modules/company/dto/company';
import { isWeekend, getHours, getMinutes, isFriday, isSunday } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface IShedule {
  shedules: CompanyDTO['schedules'];
  classNames?: string;
}

export enum ShedulesOrderByType {
  workDays = 1,
  weekends = 2
}

const Shedule: FC<IShedule> = ({ shedules, classNames }: IShedule) => {
  const { t } = useTranslation();

  const date = Date.now();

  const hour = getHours(date);
  const minutes = getMinutes(date);

  const workDaysShedule = shedules?.find(
    (s) => s.orderNumber === ShedulesOrderByType.workDays
  );
  const weekendShedule = shedules?.find(
    (s) => s.orderNumber === ShedulesOrderByType.weekends
  );
  const isWeekendToday = isWeekend(date);

  const isWorkingDays = shedules?.find(
    (shedule) =>
      shedule.orderNumber ===
      (isWeekendToday
        ? ShedulesOrderByType.weekends
        : ShedulesOrderByType.workDays)
  )?.isWorkingDays;

  const isNextDayWorking = () => {
    const isLastDayOfTheWeek = isFriday(date);
    const isLastDayOfTheWeekend = isSunday(date);

    if (isLastDayOfTheWeek) {
      return weekendShedule?.isWorkingDays;
    }
    if (isLastDayOfTheWeekend) {
      return workDaysShedule?.isWorkingDays;
    }

    return isWorkingDays;
  };

  const formatMinutes = (min: number) => (min < 10 ? `0${min}` : min);

  const getSheduleStatus = () => {
    const todayShedule = isWorkingDays ? workDaysShedule : weekendShedule;

    if (!todayShedule) return null;

    const shedule = {
      startHour: todayShedule.startHour,
      endHour: todayShedule.endHour,
      startMinutes: todayShedule.startMinute,
      endMinutes: todayShedule.endMinute
    };

    if (!isWorkingDays) {
      return t('shedule.closed');
    }

    if (
      shedule.startHour > hour ||
      (shedule.startHour === hour && shedule.startMinutes > minutes)
    ) {
      return `${t('shedule.closed')}. ${t('shedule.openAt')} ${
        shedule.startHour
      }:${formatMinutes(shedule.startMinutes)}`;
    }

    if (
      shedule.endHour < hour ||
      (shedule.endHour === hour && shedule.endMinutes < minutes)
    ) {
      return `${t('shedule.closed')}. ${
        isNextDayWorking() &&
        t('shedule.openAt') +
          ' ' +
          shedule.startHour +
          ':' +
          formatMinutes(shedule.startMinutes)
      }`;
    }

    return `${t('shedule.open')}. ${t('shedule.closesAt')} ${
      shedule.endHour
    }:${formatMinutes(shedule.endMinutes)}`;
  };

  return <div className={classNames}>{getSheduleStatus()}</div>;
};

export default Shedule;
