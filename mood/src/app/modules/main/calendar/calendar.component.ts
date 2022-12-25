import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

import { BaseControllerService, ListController, Logger } from '@shared';
import { JournalEntryModel, JournalEntryService } from '@core';

import { CalendarDay, CalendarMonth, MonthPosition } from './calendar.types';
import { CalendarUtil } from './utils';

const logger = new Logger('CalendarComponent');

@Component({
  selector: 'mood-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent
  extends ListController<JournalEntryModel>
  implements OnInit
{
  calendarMonth: CalendarMonth;
  selectedMonthIndex: number;
  selectedDayIndex: number;

  weekdayHeaderLabels = CalendarUtil.WEEKDAY_HEADER_LABELS;

  constructor(
    public baseService: BaseControllerService,
    public journalEntryService: JournalEntryService
  ) {
    super(baseService, journalEntryService);
  }

  get selectedDayObj(): dayjs.Dayjs | null {
    if (!this.calendarMonth) return null;
    const selectedDay = this.calendarMonth.days[this.selectedDayIndex];
    return dayjs(selectedDay.dayObject);
  }

  async ngOnInit() {
    await this.handleLoad(async () => {
      // select current month by default
      this.selectedMonthIndex = dayjs().month();
      this.loadMonth(this.selectedMonthIndex);

      // select current day by default
      this.selectedDayIndex = CalendarUtil.getDayIdx(this.calendarMonth);
    });
  }

  loadMonth(monthIndex: number) {
    if (this.selectedMonthIndex !== monthIndex) {
      this.selectedMonthIndex = monthIndex;
    }

    this.calendarMonth = CalendarUtil.createCalendarData(monthIndex);
    logger.info('loadMonth(): currentMonth', this.calendarMonth);
  }

  selectDay(day: CalendarDay) {
    if (day.monthPosition === MonthPosition.Previous) {
      this.loadMonth(this.selectedMonthIndex - 1);
    } else if (day.monthPosition === MonthPosition.Next) {
      this.loadMonth(this.selectedMonthIndex + 1);
    }

    this.selectedDayIndex = CalendarUtil.getDayIdx(this.calendarMonth, day);
  }
}
