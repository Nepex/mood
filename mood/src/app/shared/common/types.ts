// Generic
export enum NotifType {
  Success = 'success',
  Error = 'error',
}

export interface LoadingOptions {
  successMessage?: string;
  suppressErrors?: boolean;
  disableLoadingEmits?: boolean;
}

export interface Option {
  name: string;
  value: string;
}

export interface GenericObject {
  [key: string]: string | boolean | number;
}

export type SortOpts<T> = {
  field: keyof T;
  order: 'ASC' | 'DESC';
};

// List
export interface ListTextSearchFilter<T> {
  fields: keyof T | `${QueryOperator}${string & keyof T}`[];
  value: any;
}

export interface ListSelectFilter<T> {
  field: keyof T | `${QueryOperator}${string & keyof T}`;
  options: Option[];
  value: any;
  placeholder: string;
}

export enum ListDateFilterType {
  DateOf = 'day-of',
  AfterDate = 'after-date',
  BeforeDate = 'before-date',
}

export interface ListDateFilter<T> {
  field: keyof T | `${QueryOperator}${string & keyof T}`;
  value: any;
  placeholder: string;
  type: ListDateFilterType;
}

export interface DynamicListFilters<T> {
  textFilter: ListTextSearchFilter<T>;
  selectFilters: ListSelectFilter<T>[];
  dateFilters?: ListDateFilter<T>[];
}

export type FilterOpts<T> = {
  [key in keyof T | `${QueryOperator}${string & keyof T}`]?: any;
};

export interface FilterQueryOpts<T> {
  filters: FilterOpts<Partial<T>>[];
  sort?: SortOpts<T>[];
  limit?: number;
  offset?: number;
  fields?: string[];
  countOnly?: boolean;
}

export interface PagedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

export enum ErrorPageType {
  ServiceUnavailable = '503-unavailable',
  PageNotFound = '404',
}

export interface LayoutState {
  isMobile: boolean | undefined;
  isScrolled: boolean | undefined;
  colorTheme: ColorTheme;
  loadingProcesses: number;
  headerHeight: number;
}

export enum ColorTheme {
  Light = 'light',
  Dark = 'dark',
}

export interface Breadcrumb {
  label: string;
  routerLink?: string;
  active?: boolean;
}

// Tables
export interface TableCol {
  label: string;
  width?: string;
  field?: string;
  alignment?: 'right' | 'left' | 'center';
}

// Queries
export enum QueryOperator {
  JoinUid = '>>', // will look in joined table by uid (example >>player.uid)
  Not = '!=',
  LessThanOrEqual = '<=',
  MoreThanOrEqual = '>=',
  Between = '><',
  InArray = '@>',
  NotIn = '!|',
  ILike = '%*',
  Like = '%',
  Any = '*',
  In = '|',
  IsNull = '!',
  Equal = '=',
  LessThan = '<',
  MoreThan = '>',
}

// Menus
export interface MenuItem {
  label: string;
  icon?: string;
  innerMenu?: MenuItem[];
  routerLink?: string;
  url?: string;
  queryParams?: GenericObject;
  active?: boolean;
}
