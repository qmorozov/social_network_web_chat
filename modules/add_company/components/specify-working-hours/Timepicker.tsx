import React, { useEffect, useState } from 'react';
import { useDropDown } from '../../../../hooks/useDropDown';
import Style from './SpecifyWorkingHours.module.scss';

export const { hours, minutes } = (() => {
  const hours = [];
  const minutes = [];

  for (let i = 0; i <= 23; i++) {
    hours.push(i);
  }

  for (let j = 0; j < 60; j++) {
    if (j % 5 === 0) {
      minutes.push(j);
    }
  }

  return { hours, minutes };
})();

export const formatTimeToNormat = (time: number) =>
  time >= 10 ? time : '0' + time;

const Timepicker = ({
  setHour,
  setMinutes,
  currHour,
  currMinutes,
  openUp,
  disabled
}: any) => {
  const { opened, open, close } = useDropDown();
  const [h, setH] = useState(null);
  const [m, setM] = useState(null);

  const setTimeHandler = ({ type, val }: any) => {
    if (type === 'h') {
      setHour(val);
      setH(val);
    } else {
      setMinutes(val);
      setM(val);
    }
  };

  useEffect(() => {
    if (!opened) {
      setH(null);
      setM(null);
    }
  }, [opened, disabled]);

  useEffect(() => {
    if (h && m) {
      setH(null);
      setM(null);
      close();
    }
  }, [h, m]);

  return (
    <div className={Style.Listbox}>
      <button
        disabled={disabled}
        className={disabled ? Style.Disabled : ''}
        onClick={() => (opened ? close() : open())}
      >
        {formatTimeToNormat(currHour) + ':' + formatTimeToNormat(currMinutes)}
      </button>
      {opened && !disabled && (
        <div
          className={[Style.TimePickerWrapper, openUp ? Style.OpenUp : ''].join(
            ' '
          )}
        >
          <ul>
            {hours.map((ht: number) => (
              <li
                key={ht}
                onClick={() => setTimeHandler({ type: 'h', val: ht })}
                className={h === ht ? Style.SelectedTime : ''}
              >
                {formatTimeToNormat(ht)}
              </li>
            ))}
          </ul>
          <ul>
            {minutes.map((mt: number) => (
              <li
                key={mt}
                onClick={() => setTimeHandler({ type: 'm', val: mt })}
                className={m === mt ? Style.SelectedTime : ''}
              >
                {formatTimeToNormat(mt)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Timepicker;
