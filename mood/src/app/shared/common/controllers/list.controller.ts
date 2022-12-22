import { FilterOpts, PagedResponse, SortOpts } from '../types';

import { BaseController } from './base.controller';
import { Logger } from '../logger';
import { Paginator } from 'primeng/paginator';
import { BaseControllerService } from './base.controller.service';

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
  filters: FilterOpts<MODEL> | FilterOpts<MODEL>[] | undefined;
  staticFilters: FilterOpts<MODEL> | undefined;

  pager: Paginator | undefined;
  pagedResponse: PagedResponse<MODEL> | undefined;
  data: MODEL[] | undefined;

  protected constructor(
    public override baseService: BaseControllerService,
    public dataService: any
  ) {
    super(baseService);
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

  async applyFilters(filters: FilterOpts<MODEL>) {
    this.filters = filters;
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
