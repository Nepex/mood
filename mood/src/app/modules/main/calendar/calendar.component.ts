import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as dayjs from 'dayjs';

import {
  BaseControllerService,
  LayoutState,
  ListController,
  Logger,
  Util,
} from '@shared';
import { JournalEntryModel, JournalEntryService } from '@core';

import { CalendarDay, CalendarMonth, MonthPosition } from './calendar.types';
import { CalendarUtil } from './utils';

const logger = new Logger('CalendarComponent');

@Component({
  selector: 'mood-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [Util.getAni('transformOriginX', 'right')],
})
export class CalendarComponent
  extends ListController<JournalEntryModel>
  implements OnInit, OnDestroy
{
  stateSub: Subscription;
  layoutState: LayoutState | undefined;

  weekdayHeaderLabels = CalendarUtil.WEEKDAY_HEADER_LABELS;
  calendarMonth: CalendarMonth;
  selectedMonthIndex: number;
  selectedDayIndex: number;
  averageMoodScoreForDay: number;

  isSearchMode = false;
  searchTriggered = false;

  constructor(
    public baseService: BaseControllerService,
    public journalEntryService: JournalEntryService
  ) {
    super(baseService, journalEntryService);
    this.setSEO({ title: 'Calendar' });

    this.scrollTopOnRefresh = false;
    this.stateSub = this.baseService.store.state$.subscribe(({ layout }) => {
      this.layoutState = layout;

      if (
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.body.scrollHeight &&
        this.data &&
        this.data.length < this.totalItems
      ) {
        void this.loadItemsOnScroll();
      }
    });

    this.limit = CalendarUtil.DEFAULT_LIMIT;
    this.dynamicFilters = {
      textFilter: {
        value: '',
        fields: ['%*entry'],
      },
      selectFilters: [],
    };

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

  isDateCurrentDate(day: CalendarDay): boolean {
    return (
      dayjs().date(dayjs().date()).format('MM-DD-YYYY') ===
      day.dayObject.format('MM-DD-YYYY')
    );
  }

  isEntryCurrentDate(entryAt: Date): boolean {
    return (
      dayjs().date(dayjs().date()).format('MM-DD-YYYY') ===
      dayjs(entryAt).format('MM-DD-YYYY')
    );
  }

  async ngOnInit() {
    await this.handleLoad(
      async () => {
        this.selectedMonthIndex = dayjs().month();
        this.selectMonth(this.selectedMonthIndex);
        await this.selectDay({ loadCurrentDate: true });
      },
      { disableGlobalLoad: !this.layoutState?.isMobile }
    );
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  selectMonth(monthIndex: number) {
    this.calendarMonth = CalendarUtil.createCalendarMonthData(monthIndex);
    this.selectedMonthIndex = monthIndex;
  }

  async selectDay(args: { day?: CalendarDay; loadCurrentDate?: boolean }) {
    this.limit = CalendarUtil.DEFAULT_LIMIT;
    const { day, loadCurrentDate } = args;

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

    if (this.selectedDayObj) {
      this.staticFilters = {
        '><entryAt': CalendarUtil.buildCurrentDayFilters(this.selectedDayObj),
      };
    }

    await this.handleListLoad(
      async () => {
        const res = await Promise.all([
          this.fetchData(),
          this.journalEntryService.getAverageMoodScoreForDay(
            new Date((<dayjs.Dayjs>this.selectedDayObj).format('MM-DD-YYYY'))
          ),
        ]);

        this.averageMoodScoreForDay = res[1];
      },
      { loadDelay: true, disableGlobalLoad: !this.layoutState?.isMobile }
    );
  }

  async triggerSearch() {
    this.limit = CalendarUtil.DEFAULT_LIMIT;
    window.scrollTo(0, 500);

    if (!this.dynamicFilters.textFilter.value) {
      await this.clearSearch();
      this.searchTriggered = false;
      return;
    }

    await this.handleListLoad(
      async () => {
        this.staticFilters = {};
        await this.fetchData();
        CalendarUtil.highlightSearchedTerms(
          this.data,
          this.dynamicFilters.textFilter.value
        );
        this.searchTriggered = true;
      },
      { loadDelay: true }
    );
  }

  async clearSearch() {
    if (!this.dynamicFilters.textFilter.value) {
      return;
    }

    this.limit = CalendarUtil.DEFAULT_LIMIT;
    window.scrollTo(0, 500);

    await this.handleListLoad(
      async () => {
        this.dynamicFilters.textFilter.value = '';

        if (this.selectedDayObj) {
          this.staticFilters = {
            '><entryAt': CalendarUtil.buildCurrentDayFilters(
              this.selectedDayObj
            ),
          };
        }

        await this.fetchData();
        this.searchTriggered = false;
      },
      { loadDelay: true }
    );
  }

  async loadItemsOnScroll() {
    await this.handleListLoad(
      async () => {
        this.limit = this.limit + 5;
        await this.fetchData();

        if (this.searchTriggered) {
          CalendarUtil.highlightSearchedTerms(
            this.data,
            this.dynamicFilters.textFilter.value
          );
        }
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
        await this.handleListUpdate(
          async () => {
            await this.journalEntryService.removeByUid(journalEntry.uid);
          },
          { successMessage: 'Successfully removed entry!', loadDelay: true }
        );
      },
    });
  }
}
