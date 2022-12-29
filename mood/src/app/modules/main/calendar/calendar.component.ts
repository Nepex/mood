import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

import { BaseControllerService, ListController, Logger, Util } from '@shared';
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
  isCalendarLoading = false;
  calendarMonth: CalendarMonth;
  selectedMonthIndex: number;
  selectedDayIndex: number;

  weekdayHeaderLabels = CalendarUtil.WEEKDAY_HEADER_LABELS;

  constructor(
    public baseService: BaseControllerService,
    public journalEntryService: JournalEntryService
  ) {
    super(baseService, journalEntryService);

    this.limit = 100;
    this.sort = [
      {
        field: 'entryAt',
        order: 'DESC',
      },
    ];
  }

  get selectedDayObj(): dayjs.Dayjs | null {
    if (!this.calendarMonth) return null;
    const selectedDay = this.calendarMonth.days[this.selectedDayIndex];
    return dayjs(selectedDay?.dayObject);
  }

  get isSelectedDayCurrentDay(): boolean {
    const selectedDay = this.calendarMonth.days[this.selectedDayIndex];
    const currentDate = dayjs().date(dayjs().date());

    if (
      dayjs(selectedDay.dayObject).format('MM-DD-YYYY') ===
      currentDate.format('MM-DD-YYYY')
    ) {
      return true;
    }

    return false;
  }

  async ngOnInit() {
    await this.handleLoad(
      async () => {
        // select current month by default
        this.selectedMonthIndex = dayjs().month();
        this.selectMonth(this.selectedMonthIndex);

        // select current day by default
        await this.selectDay({ loadCurrentDate: true });
      },
      { disableGlobalLoad: true }
    );
  }

  selectMonth(monthIndex: number) {
    this.isCalendarLoading = true;

    this.calendarMonth = CalendarUtil.createCalendarData(monthIndex);

    this.selectedMonthIndex = monthIndex;
    this.isCalendarLoading = false;
  }

  // selects current day when no CalendarDay is passed in
  async selectDay(args: { day?: CalendarDay; loadCurrentDate?: boolean }) {
    this.isCalendarLoading = true;
    const { day, loadCurrentDate } = args;

    await this.handleListLoad(
      async () => {
        if (day?.monthPosition === MonthPosition.Previous) {
          this.selectMonth(this.selectedMonthIndex - 1);
        } else if (day?.monthPosition === MonthPosition.Next) {
          this.selectMonth(this.selectedMonthIndex + 1);
        }

        // get day index reference off of calendarMonth
        this.selectedDayIndex = CalendarUtil.getDayIdx({
          calendarMonth: this.calendarMonth,
          calendarDay: day,
          loadCurrentDate,
        });

        // set filters to pull journal entries for this day
        const startOfDay = `${dayjs(this.selectedDayObj).format(
          'YYYY-MM-DD'
        )}T00:00:00.411Z`;

        const endOfDay = `${dayjs(this.selectedDayObj).format(
          'YYYY-MM-DD'
        )}T23:59:59.411Z`;

        this.staticFilters = {
          '><entryAt': `${startOfDay},${endOfDay}`,
        };

        await this.fetchData();
      },
      { loadDelay: true }
    );
    this.isCalendarLoading = false;
  }

  isDateCurrentDate(day: CalendarDay): boolean {
    return (
      dayjs().date(dayjs().date()).format('MM-DD-YYYY') ===
      day.dayObject.format('MM-DD-YYYY')
    );
  }

  confirmDeleteEntry(event: Event, journalEntry: JournalEntryModel) {
    this.baseService.confirmationService.confirm({
      target: event.target as any,
      message: 'Are you sure that you want to delete this entry?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.deleteEntry(journalEntry);
      },
    });
  }

  async deleteEntry(journalEntry: JournalEntryModel) {
    await this.handleListUpdate(
      async () => {
        await this.journalEntryService.removeByUid(journalEntry.uid);
      },
      { successMessage: 'Successfully removed entry!', loadDelay: true }
    );
  }
}
