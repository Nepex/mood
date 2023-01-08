import * as dayjs from 'dayjs';

export enum Emoji {}

export interface DayTrendData {
  dayNumber: number;
  dayObject: dayjs.Dayjs;
  score: number;
}
