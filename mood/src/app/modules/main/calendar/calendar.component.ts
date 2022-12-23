import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

import { BaseControllerService, ListController, Logger } from '@shared';
import { JournalEntryModel, JournalEntryService } from '@core';

import { CalendarDay, CalendarMonth } from './calendar.types';
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
  currentMonth: CalendarMonth;
  selectedMonthIndex: number;

  weekdayHeaderLabels = CalendarUtil.WEEKDAY_HEADER_LABELS;
  selectedDay: CalendarDay;

  constructor(
    public baseService: BaseControllerService,
    public journalEntryService: JournalEntryService
  ) {
    super(baseService, journalEntryService);
  }

  async ngOnInit() {
    await this.handleLoad(async () => {
      // select current month by default
      this.selectedMonthIndex = dayjs().month();
      this.loadMonth(this.selectedMonthIndex);
    });
  }

  loadMonth(monthIndex: number) {
    if (this.selectedMonthIndex !== monthIndex) {
      this.selectedMonthIndex = monthIndex;
    }

    this.currentMonth = CalendarUtil.createCalendarData(monthIndex);
    logger.info('loadMonth(): currentMonth', this.currentMonth);
  }
}
