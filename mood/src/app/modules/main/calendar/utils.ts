import { JournalEntryModel } from '@core';
import * as dayjs from 'dayjs';
import { CalendarDay, CalendarMonth, MonthPosition } from './calendar.types';

dayjs.extend(require('dayjs/plugin/localeData'));

export class CalendarUtil {
  static WEEKDAY_HEADER_LABELS: string[] = (<any>dayjs).weekdaysShort();
  static DEFAULT_LIMIT = 5;

  static createCalendarMonthData(monthIndex: number): CalendarMonth {
    const previousMonth = this.getMonthData(
      monthIndex - 1,
      MonthPosition.Previous
    );
    const currentMonth = this.getMonthData(monthIndex, MonthPosition.Current);
    const nextMonth = this.getMonthData(monthIndex + 1, MonthPosition.Next);

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

  static getDayIdx(args: {
    calendarMonth: CalendarMonth;
    calendarDay?: CalendarDay;
    loadCurrentDate?: boolean;
  }): number {
    const { calendarMonth, calendarDay, loadCurrentDate } = args;
    let dayNumber: number;

    if (loadCurrentDate) {
      // load today's date
      dayNumber = dayjs().date();
    } else if (calendarDay) {
      // load provided calendarDay
      dayNumber = calendarDay.dayNumber;
    } else {
      // load first day of month
      return calendarMonth.days.findIndex(
        (day) =>
          day.dayNumber === 1 && day.monthPosition === MonthPosition.Current
      );
    }

    return calendarMonth.days.findIndex(
      (day) =>
        day.dayNumber === dayNumber &&
        day.monthPosition === MonthPosition.Current
    );
  }

  static buildCurrentDayFilters(dayObj: dayjs.Dayjs): string {
    const date = new Date(dayjs(dayObj).format('MM-DD-YYYY'));
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return `${startOfDay.toISOString()},${endOfDay.toISOString()}`;
  }

  static highlightSearchedTerms(
    data: JournalEntryModel[] | undefined,
    term: string
  ): JournalEntryModel[] {
    if (!data) return [];

    return data.map((d) => {
      return {
        ...d,
        entry: d.entry.replace(
          new RegExp(term, 'gi'),
          `<b style="background-color: #a582e0; color: #fff">$&<\/b>`
        ),
      };
    });
  }
}
