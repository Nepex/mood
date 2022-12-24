import * as dayjs from 'dayjs';
import { CalendarDay, CalendarMonth, MonthPosition } from './calendar.types';

dayjs.extend(require('dayjs/plugin/localeData'));

export class CalendarUtil {
  static WEEKDAY_HEADER_LABELS: string[] = (<any>dayjs).weekdaysShort();

  static createCalendarData(monthIndex: number): CalendarMonth {
    const previousMonth = this.getMonthData(
      monthIndex - 1,
      MonthPosition.Previous
    );
    const currentMonth = this.getMonthData(monthIndex, MonthPosition.Current);
    const nextMonth = this.getMonthData(monthIndex, MonthPosition.Next);

    // TODO: probably append day settings and entries to current month here

    // find what day of month first day falls on
    const daysInFirstWeek = 7 - dayjs(currentMonth.days[0].dayObject).day();

    // prepend days from previous month
    const prependDaysAmount = 7 - daysInFirstWeek;
    const prevDaysReversed = previousMonth.days.reverse();

    for (let i = 0; i < prependDaysAmount; i++) {
      currentMonth.days.unshift(prevDaysReversed[i]);
    }

    // append days from next month (based on 42 tile grid)
    const appendDaysAmount = 42 - currentMonth.days.length;

    for (let i = 0; i < appendDaysAmount; i++) {
      currentMonth.days.push(nextMonth.days[i]);
    }

    return currentMonth;
  }

  static getMonthData(
    monthIndex: number,
    monthPosition: MonthPosition
  ): CalendarMonth {
    const month = dayjs().month(monthIndex);

    const calendarMonth: CalendarMonth = {
      days: [],
      yearNumber: month.year(),
      monthName: month.format('MMMM'),
      monthShortName: month.format('MMM'),
      monthNumber: +month.format('MM'),
      monthObject: month,
    };

    const daysInMonth = dayjs(month).daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = dayjs(month).date(i);

      calendarMonth.days.push({
        dayName: day.format('dddd'),
        dayShortName: day.format('ddd'),
        dayNumber: i,
        dayObject: day,
        monthPosition,
      });
    }

    return calendarMonth;
  }

  static getDayIdx(
    calendarMonth: CalendarMonth,
    calendarDay?: CalendarDay
  ): number {
    // fall back to current date if no day is provided
    const dayNumber = calendarDay?.dayNumber ?? dayjs().date();

    return calendarMonth.days.findIndex(
      (day) =>
        day.dayNumber === dayNumber &&
        day.monthPosition === MonthPosition.Current
    );
  }
}
