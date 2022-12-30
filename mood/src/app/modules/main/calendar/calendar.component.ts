import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

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

  calendarMonth: CalendarMonth;
  selectedMonthIndex: number;
  selectedDayIndex: number;
  averageMoodScoreForDay: number;

  weekdayHeaderLabels = CalendarUtil.WEEKDAY_HEADER_LABELS;
  isSearchMode = false;
  searchTriggered = false;

  constructor(
    public baseService: BaseControllerService,
    public journalEntryService: JournalEntryService
  ) {
    super(baseService, journalEntryService);

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

    this.scrollTopOnRefresh = false;
    this.limit = 5;
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
        // select current month by default
        this.selectedMonthIndex = dayjs().month();
        this.selectMonth(this.selectedMonthIndex);

        // select current day by default
        await this.selectDay({ loadCurrentDate: true });
      },
      { disableGlobalLoad: !this.layoutState?.isMobile }
    );
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  selectMonth(monthIndex: number) {
    this.calendarMonth = CalendarUtil.createCalendarData(monthIndex);
    this.selectedMonthIndex = monthIndex;
  }

  // selects current day when no CalendarDay is passed in
  async selectDay(args: { day?: CalendarDay; loadCurrentDate?: boolean }) {
    const { day, loadCurrentDate } = args;
    this.limit = 5;

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
    this.setSelectedDateFilters();

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

  setSelectedDateFilters() {
    if (this.selectedDayObj) {
      this.staticFilters = {
        '><entryAt': CalendarUtil.buildCurrentDayFilters(this.selectedDayObj),
      };
    }
  }

  async triggerSearch() {
    this.limit = 5;

    if (!this.dynamicFilters.textFilter.value) {
      await this.clearSearch();
      this.searchTriggered = false;
      return;
    }

    await this.handleListLoad(
      async () => {
        this.staticFilters = {};
        await this.fetchData();
        this.highlightSearchedTerms();
        this.searchTriggered = true;
      },
      { loadDelay: true, disableGlobalLoad: !this.layoutState?.isMobile }
    );
  }

  async clearSearch() {
    this.limit = 5;

    if (!this.dynamicFilters.textFilter.value) {
      return;
    }

    await this.handleListLoad(
      async () => {
        this.dynamicFilters.textFilter.value = '';
        this.setSelectedDateFilters();
        await this.fetchData();
        this.searchTriggered = false;
      },
      { loadDelay: true, disableGlobalLoad: !this.layoutState?.isMobile }
    );
  }

  highlightSearchedTerms() {
    if (this.data) {
      this.data = this.data.map((d) => {
        return {
          ...d,
          entry: d.entry.replace(
            new RegExp(this.dynamicFilters.textFilter.value, 'gi'),
            `<b style="background-color: #a582e0; color: #fff">$&<\/b>`
          ),
        };
      });
    }
  }

  async loadItemsOnScroll() {
    await this.handleListLoad(
      async () => {
        this.limit = this.limit + 5;
        await this.fetchData();

        if (this.searchTriggered) {
          this.highlightSearchedTerms();
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
