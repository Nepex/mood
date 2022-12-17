import { JournalDaySettingsModel, JournalEntryModel } from '@core';
import * as dayjs from 'dayjs';

export interface CalendarMonth {
  days: CalendarDay[];
  yearNumber: number;
  monthName: string;
  monthShortName: string;
  monthNumber: number;
  monthObject: dayjs.Dayjs;
}

export interface CalendarDay {
  dayName: string;
  dayNumber: number;
  dayShortName: string;
  dayObject: dayjs.Dayjs;
  monthPosition: MonthPosition;
  settings?: JournalDaySettingsModel;
  entries?: JournalEntryModel[];
}

export enum MonthPosition {
  Previous = 'previous',
  Current = 'current',
  Next = 'next',
}
