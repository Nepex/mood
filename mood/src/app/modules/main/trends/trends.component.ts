import { Component, OnInit } from '@angular/core';
import { JournalEntryService } from '@core';
import { BaseController, BaseControllerService, Logger } from '@shared';

const logger = new Logger('TrendsComponent');

@Component({
  selector: 'mood-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss'],
})
export class TrendsComponent extends BaseController implements OnInit {
  data: any;
  monthFilter = new Date();

  constructor(
    public baseService: BaseControllerService,
    private readonly journalEntryService: JournalEntryService
  ) {
    super(baseService);

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
  }

  async ngOnInit() {
    await this.handleLoad(
      async () => {
        await this.loadMonthTrends();
      },
      { disableGlobalLoad: true }
    );
  }

  async loadMonthTrends() {
    const trendData = await this.journalEntryService.getTrendDataForMonth(
      this.monthFilter
    );

    logger.info('loadMonthTrends(): trendData', trendData);
  }
}
