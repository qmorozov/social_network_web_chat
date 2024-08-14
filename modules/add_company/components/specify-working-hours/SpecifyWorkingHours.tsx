import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShedulesOrderByType } from '../../../../component/shedule/Shedule';
import { useActions } from '../../../../hooks/useActions';
import { useDropDown } from '../../../../hooks/useDropDown';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { AddCompanySlice } from '../../store/add-company';
import BtnOpenSelect from '../btn-open-select/BtnOpenSelect';
import Style from './SpecifyWorkingHours.module.scss';
import Timepicker, { formatTimeToNormat, hours, minutes } from './Timepicker';

type ReverseMap<T> = T[keyof T];

export enum Days {
  mon = 'Mon',
  tue = 'Tue',
  wed = 'Wed',
  thu = 'Thu',
  fri = 'Fri',
  sat = 'Sat',
  sun = 'Sun'
}

export type ReverseDays = ReverseMap<typeof Days>;

export type SelectedDay = {
  name: ReverseDays;
  orderType: ShedulesOrderByType.workDays | ShedulesOrderByType.weekends | null;
  isSelected: boolean;
  isWorkingDay: boolean;
};

const SpecifyWorkingHours: FC = () => {
  const { t } = useTranslation();

  const { shedule, days } = useTypedSelector((state) => state.addCompany);

  const { workDays, weekends } = shedule;
  const { setShedule, setDays } = useActions(AddCompanySlice);
  const { opened, open, close } = useDropDown();

  const [workDaySelectedTime, setWorkDaySelectedTime] = useState({
    startHour: workDays.startHour,
    startMinute: workDays.startMinute,
    endHour: workDays.endHour,
    endMinute: workDays.endMinute,
    isWorkingDays: true
  });
  const [weekendsSelectedTime, setWeekendsSelectedTime] = useState({
    startHour: weekends.startHour,
    startMinute: weekends.startMinute,
    endHour: weekends.endHour,
    endMinute: weekends.endMinute,
    isWorkingDays: true
  });

  useEffect(() => {
    setShedule({
      workDays: workDaySelectedTime,
      weekends: weekendsSelectedTime
    });
  }, [workDaySelectedTime, weekendsSelectedTime]);

  const [disabledWorkTime, setDisabledWorkTime] = useState(false);
  const [disabledWeekends, setDisabledWeekends] = useState(true);

  const generateTitle = () => {
    let title = '';
    if (
      days.filter((d) => d.orderType === ShedulesOrderByType.workDays).length >
      0
    ) {
      days.map((d) => {
        if (d.orderType === ShedulesOrderByType.workDays) {
          return (title += d.name + '/');
        }
      });
      title +=
        formatTimeToNormat(workDaySelectedTime.startHour) +
        ':' +
        formatTimeToNormat(workDaySelectedTime.startMinute) +
        '-' +
        formatTimeToNormat(workDaySelectedTime.endHour) +
        ':' +
        formatTimeToNormat(workDaySelectedTime.endMinute) +
        ' | ';
    }

    if (
      days.filter((d) => d.orderType === ShedulesOrderByType.weekends).length >
      0
    ) {
      days.map((d) => {
        if (d.orderType === ShedulesOrderByType.weekends) {
          return (title += d.name + '/');
        }
      });
      title +=
        formatTimeToNormat(weekendsSelectedTime.startHour) +
        ':' +
        formatTimeToNormat(weekendsSelectedTime.startMinute) +
        '-' +
        formatTimeToNormat(weekendsSelectedTime.endHour) +
        ':' +
        formatTimeToNormat(weekendsSelectedTime.endMinute);
    }

    if (!title.length) {
      return t('add-company.specify-working-hours.title');
    }

    return title;
  };

  return (
    <div className="form-control -column">
      <BtnOpenSelect
        onClick={() => (opened ? close() : open())}
        title={
          days.length
            ? generateTitle()
            : t('add-company.specify-working-hours.title')
        }
      />
      <div
        className={[
          Style.TimeBlock,
          opened ? Style.ShowTime : Style.HideTime
        ].join(' ')}
      >
        <div>
          <h2 className={Style.Title}>Working days:</h2>
          <ul className={['filters', Style.Filter].join(' ')}>
            {days
              .filter(
                (d) =>
                  (d.isSelected &&
                    d.orderType === ShedulesOrderByType.workDays) ||
                  !d.isSelected
              )
              .map((day) => (
                <li
                  key={day.name}
                  onClick={() => {
                    setDays(
                      days.map((p) => {
                        if (p.name === day.name) {
                          return {
                            ...day,
                            isWorkingDay: true,
                            isSelected: !day.isSelected,
                            orderType: !day.isSelected
                              ? ShedulesOrderByType.workDays
                              : null
                          };
                        }
                        return p;
                      })
                    );
                  }}
                >
                  <a
                    className={[
                      'pill',
                      Style.Day,
                      days.find((d) => d.name === day.name && d.isSelected)
                        ? Style.SelectedDay
                        : ''
                    ].join(' ')}
                  >
                    {day.name}
                  </a>
                </li>
              ))}
          </ul>

          <div className={Style.Time}>
            <Timepicker
              disabled={disabledWorkTime}
              currHour={workDaySelectedTime.startHour}
              currMinutes={workDaySelectedTime.startMinute}
              setMinutes={(m: number) => {
                setWorkDaySelectedTime((prev) => ({
                  ...prev,
                  startMinute: m
                }));
              }}
              setHour={(h: number) => {
                setWorkDaySelectedTime((prev) => ({
                  ...prev,
                  startHour: h
                }));
              }}
            />
            <Timepicker
              disabled={disabledWorkTime}
              currHour={workDaySelectedTime.endHour}
              currMinutes={workDaySelectedTime.endMinute}
              setMinutes={(m: number) => {
                setWorkDaySelectedTime((prev) => ({
                  ...prev,
                  endMinute: m
                }));
              }}
              setHour={(h: number) => {
                setWorkDaySelectedTime((prev) => ({
                  ...prev,
                  endHour: h
                }));
              }}
            />
          </div>

          <div className={Style.Checkbox}>
            <input
              type="checkbox"
              id="day"
              name="day"
              onChange={(e) => {
                setDisabledWorkTime(e.target.checked);
                setWorkDaySelectedTime({
                  startHour: hours[0],
                  startMinute: minutes[0],
                  endHour: hours[hours.length - 1],
                  endMinute: e.target.checked
                    ? 59
                    : minutes[minutes.length - 1],
                  isWorkingDays: true
                });
              }}
            />
            <label htmlFor="day">24 hours a day</label>
          </div>
        </div>
        <div className={Style.WeekendsWrapper}>
          <h2 className={Style.Title}>Weekends:</h2>
          <ul className={['filters', Style.Filter].join(' ')}>
            {days
              .filter(
                (d) =>
                  !d.isSelected ||
                  d.orderType === ShedulesOrderByType.weekends ||
                  !d.orderType
              )
              .map((day) => (
                <li
                  key={day.name}
                  onClick={() => {
                    setDays(
                      days.map((p) => {
                        if (p.name === day.name) {
                          return {
                            ...day,
                            isWorkingDay: !day.isSelected,
                            isSelected: !day.isSelected,
                            orderType: !day.isSelected
                              ? ShedulesOrderByType.weekends
                              : null
                          };
                        }
                        return p;
                      })
                    );
                  }}
                >
                  <a
                    className={[
                      'pill',
                      Style.Day,
                      days.find((d) => d.name === day.name && d.isSelected)
                        ? Style.SelectedDay
                        : ''
                    ].join(' ')}
                  >
                    {day.name}
                  </a>
                </li>
              ))}
          </ul>
          <div className={[Style.Time, Style.TimeUp].join(' ')}>
            <Timepicker
              disabled={disabledWeekends}
              openUp={true}
              currHour={weekendsSelectedTime.startHour}
              currMinutes={weekendsSelectedTime.startMinute}
              setMinutes={(m: number) => {
                setWeekendsSelectedTime((prev) => ({
                  ...prev,
                  startMinute: m
                }));
              }}
              setHour={(h: number) => {
                setWeekendsSelectedTime((prev) => ({
                  ...prev,
                  startHour: h
                }));
              }}
            />
            <Timepicker
              disabled={disabledWeekends}
              openUp={true}
              currHour={weekendsSelectedTime.endHour}
              currMinutes={weekendsSelectedTime.endMinute}
              setMinutes={(m: number) => {
                setWeekendsSelectedTime((prev) => ({
                  ...prev,
                  endMinute: m
                }));
              }}
              setHour={(h: number) => {
                setWeekendsSelectedTime((prev) => ({
                  ...prev,
                  endHour: h
                }));
              }}
            />
          </div>
          <div className={Style.Checkbox}>
            <input
              type="checkbox"
              defaultChecked={true}
              id="Noworking"
              name="Noworking"
              onChange={(e) => {
                setDisabledWeekends(e.target.checked);
                const withoutWeekends = days.map((d) => {
                  if (d.orderType === ShedulesOrderByType.weekends) {
                    return {
                      ...d,
                      isWorkingDay: !e.target.checked
                    };
                  }
                  return d;
                });
                setWeekendsSelectedTime((prev) => {
                  return {
                    ...prev,
                    isWorkingDays: !e.target.checked
                  };
                });
                setDays(withoutWeekends);
              }}
            />
            <label htmlFor="Noworking">Non-working days</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecifyWorkingHours;
