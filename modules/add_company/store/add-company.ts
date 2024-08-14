import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddAdressCallback } from '../../../component/add-adress/AddAdress';
import { SelectItem } from '../../../component/select-list/Select';
import { ShedulesOrderByType } from '../../../component/shedule/Shedule';
import {
  Days,
  SelectedDay
} from '../components/specify-working-hours/SpecifyWorkingHours';
import { hours, minutes } from '../components/specify-working-hours/Timepicker';

export interface IAddCompanyState {
  name: string;
  email: string;
  businessCategory: SelectItem | null;
  adress: AddAdressCallback | null;
  days: SelectedDay[];
  shedule: {
    workDays: {
      startHour: number;
      startMinute: number;
      endHour: number;
      endMinute: number;
      isWorkingDays: boolean;
    };
    weekends: {
      startHour: number;
      startMinute: number;
      endHour: number;
      endMinute: number;
      isWorkingDays: boolean;
    };
  };
}

const initialState: IAddCompanyState = {
  name: '',
  email: '',
  businessCategory: null,
  adress: null,
  shedule: {
    workDays: {
      startHour: hours[8],
      startMinute: minutes[0],
      endHour: hours[18],
      endMinute: minutes[0],
      isWorkingDays: true
    },
    weekends: {
      startHour: hours[8],
      startMinute: minutes[0],
      endHour: hours[18],
      endMinute: minutes[0],
      isWorkingDays: false
    }
  },
  days: [
    {
      name: Days.mon,
      orderType: ShedulesOrderByType.workDays,
      isSelected: true,
      isWorkingDay: true
    },
    {
      name: Days.tue,
      orderType: ShedulesOrderByType.workDays,
      isSelected: true,
      isWorkingDay: true
    },
    {
      name: Days.wed,
      orderType: ShedulesOrderByType.workDays,
      isSelected: true,
      isWorkingDay: true
    },
    {
      name: Days.thu,
      orderType: ShedulesOrderByType.workDays,
      isSelected: true,
      isWorkingDay: true
    },
    {
      name: Days.fri,
      orderType: ShedulesOrderByType.workDays,
      isSelected: true,
      isWorkingDay: true
    },
    {
      name: Days.sat,
      orderType: ShedulesOrderByType.weekends,
      isSelected: true,
      isWorkingDay: false
    },
    {
      name: Days.sun,
      orderType: ShedulesOrderByType.weekends,
      isSelected: true,
      isWorkingDay: false
    }
  ]
};

export const AddCompanySlice = createSlice({
  name: 'addCompany',
  initialState,
  reducers: {
    setCompanyName(state, action: PayloadAction<string>) {
      return {
        ...state,
        name: action.payload
      };
    },
    setCompanyEmail(state, action: PayloadAction<string>) {
      return {
        ...state,
        email: action.payload
      };
    },
    setCategory(state, action: PayloadAction<SelectItem>) {
      return {
        ...state,
        businessCategory: action.payload
      };
    },
    setAdress(state, action: PayloadAction<AddAdressCallback | null>) {
      return {
        ...state,
        adress: action.payload
      };
    },
    setShedule(state, action: PayloadAction<any>) {
      return {
        ...state,
        shedule: action.payload
      };
    },
    setDays(state, action: PayloadAction<SelectedDay[]>) {
      return {
        ...state,
        days: action.payload
      };
    }
  }
});

export const AddCompanyReducer = AddCompanySlice.reducer;

export default AddCompanyReducer;
