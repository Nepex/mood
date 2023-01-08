import { Component, OnInit } from '@angular/core';
import { JournalEntryService } from '@core';
import { BaseController, BaseControllerService, Logger, Util } from '@shared';

const logger = new Logger('TrendsComponent');

type ChartData = {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    tension?: number;
    borderColor?: string;
  }[];
};

@Component({
  selector: 'mood-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss'],
})
export class TrendsComponent extends BaseController implements OnInit {
  data: ChartData;
  options = {
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          color: '#d3dadd',
        },
      },
      x: {
        ticks: {
          color: '#d3dadd',
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: false,
    },
  };
  monthFilter = new Date();

  constructor(
    public baseService: BaseControllerService,
    private readonly journalEntryService: JournalEntryService
  ) {
    super(baseService);
  }

  async ngOnInit() {
    await this.loadMonthTrends();
  }

  async loadMonthTrends() {
    await this.handleLoad(
      async () => {
        await this.sleep(Util.SOFT_DELAY);
        const trendData = await this.journalEntryService.getTrendDataForMonth(
          this.monthFilter
        );

        logger.info('loadMonthTrends(): trendData', trendData);

        const data: ChartData = {
          labels: [],
          datasets: [
            {
              label: 'Score',
              data: [],
              tension: 0.4,
              borderColor: '#C2ABEA',
            },
          ],
        };

        for (const dayData of trendData) {
          data.labels.push(dayData.dayNumber.toString());
          data.datasets[0].data.push(dayData.score);
        }

        this.data = data;
      },
      { disableGlobalLoad: true }
    );
  }
}
