import {
  DynamicListFilters,
  FilterOpts,
  ListLoadingOptions,
  LoadingOptions,
  PagedResponse,
  SortOpts,
} from '../types';

import { BaseController } from './base.controller';
import { Logger } from '../logger';
import { Paginator } from 'primeng/paginator';
import { BaseControllerService } from './base.controller.service';
import { Util } from '../util';

const logger = new Logger('ListController');

export abstract class ListController<MODEL = any> extends BaseController {
  limit = 10;
  page = 1;
  offset = 0;
  totalItems = 0;
  totalPages = 0;
  scrollTopOnRefresh = true;
  isListLoading = false;

  sort: SortOpts<MODEL>[] | undefined;
  staticFilters: FilterOpts<MODEL> | undefined;
  dynamicFilters: DynamicListFilters<MODEL> | undefined;

  pager: Paginator | undefined;
  pagedResponse: PagedResponse<MODEL> | undefined;
  data: MODEL[] | undefined;

  protected constructor(
    public override baseService: BaseControllerService,
    public dataService: any
  ) {
    super(baseService);
  }

  get filters(): FilterOpts<MODEL>[] {
    if (!this.staticFilters && !this.dynamicFilters) return [];

    const baseFilter = this.staticFilters ? { ...this.staticFilters } : {};

    // TODO: code in dynamic filters
    const filters = [baseFilter];

    return filters;
  }

  async handleListLoad(fn: any, options: ListLoadingOptions = {}) {
    await super.handleLoad(
      async () => {
        this.isListLoading = true;
        try {
          if (options.loadDelay) {
            await this.sleep(Util.SOFT_DELAY + 250);
          }

          await fn();
          this.isListLoading = false;
        } catch (err) {
          this.isListLoading = false;
          return Promise.reject(err);
        }
      },
      { disableGlobalLoad: true, ...options }
    );
  }

  async handleListUpdate(fn: any, options: ListLoadingOptions = {}) {
    await this.handleListLoad(async () => {
      await fn();
      await this.fetchData();
    }, options);
  }

  async fetchData() {
    this.isListLoading = true;

    this.pagedResponse = await this.dataService.search({
      filters: this.filters,
      sort: this.sort,
      limit: this.limit,
      offset: this.offset,
    });

    if (!this.pagedResponse) return;

    this.data = this.pagedResponse.data;
    this.totalItems = this.pagedResponse.totalItems;
    this.totalPages = this.pagedResponse.totalPages;
    this.baseService.listRefreshed.emit();

    if (this.scrollTopOnRefresh) {
      this.scrollToTop();
    }

    logger.info('fetchData(), data', this.data);
    this.isListLoading = false;
  }

  async applyPageChange(pageNumber: number) {
    // Prevent recursion from filter set / change page call
    if (this.offset === 0 && pageNumber === 0) {
      return;
    }

    this.page = pageNumber;
    this.offset = pageNumber * this.limit;

    await this.fetchData();
  }

  async applyFilters() {
    this.page = 0;
    this.offset = 0;
    this.pager?.changePage(0);

    await this.fetchData();
  }

  async applySort(field: keyof MODEL) {
    if (!this.sort) return;

    let order: 'ASC' | 'DESC';

    const idx = this.sort.findIndex((s) => s.field === field);

    if (idx > -1 && this.sort[idx].order === 'ASC') {
      order = 'DESC';
    } else {
      order = 'ASC';
    }

    this.sort[idx].order = order;
    await this.fetchData();
  }
}
