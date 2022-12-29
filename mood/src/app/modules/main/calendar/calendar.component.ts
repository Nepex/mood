import { Component, OnDestroy, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

import { BaseControllerService, ListController, Logger, Util } from '@shared';
import { JournalEntryModel, JournalEntryService } from '@core';

import { CalendarDay, CalendarMonth, MonthPosition } from './calendar.types';
import { CalendarUtil } from './utils';
import { Subscription } from 'rxjs';

const logger = new Logger('CalendarComponent');

@Component({
  selector: 'mood-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent
  extends ListController<JournalEntryModel>
  implements OnInit, OnDestroy
{
  isCalendarLoading = false;
  stateSub: Subscription;

  calendarMonth: CalendarMonth;
  selectedMonthIndex: number;
  selectedDayIndex: number;
  averageMoodScoreForDay: number;

  weekdayHeaderLabels = CalendarUtil.WEEKDAY_HEADER_LABELS;

  constructor(
    public baseService: BaseControllerService,
    public journalEntryService: JournalEntryService
  ) {
    super(baseService, journalEntryService);

    this.stateSub = this.baseService.store.state$.subscribe(() => {
      if (
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.body.scrollHeight &&
        this.data &&
        this.data.length < this.totalItems
      ) {
        void this.loadItemsOnScroll();
      }
    });

    this.scrollTopOnRefresh = false;
    this.limit = 5;
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

  ngOnDestroy() {
    this.stateSub.unsubscribe();
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
        const date = new Date(dayjs(this.selectedDayObj).format('MM-DD-YYYY'));
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        endOfDay.setUTCHours(23, 59, 59, 999);

        this.staticFilters = {
          '><entryAt': `${startOfDay.toISOString()},${endOfDay.toISOString()}`,
        };

        const res = await Promise.all([
          this.fetchData(),
          this.journalEntryService.getAverageMoodScoreForDay(
            new Date((<dayjs.Dayjs>this.selectedDayObj).format('MM-DD-YYYY'))
          ),
        ]);

        await this.fetchData();
        this.averageMoodScoreForDay = res[1];
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

  async loadItemsOnScroll() {
    await this.handleListLoad(
      async () => {
        this.limit = this.limit + 5;
        await this.fetchData();
      },
      { loadDelay: true }
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
