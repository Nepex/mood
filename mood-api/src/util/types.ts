import { QueryOperator } from '../query/query.service';

export interface Credentials {
  email: string;
  password: string;
}

export interface Session {
  token: string;
}

export interface FilterQueryOpts<T> {
  filters?: FilterOpts<Partial<T>>[];
  sort?: SortOpts<T>[];
  limit?: number;
  offset?: number;
  fields?: string[];
  countOnly?: boolean;
}

export type SortOpts<T> = {
  field: keyof T;
  order: 'ASC' | 'DESC';
};

export type FilterOpts<T> = {
  [key in keyof T | `${QueryOperator}${string & keyof T}`]?: any;
};

export interface PagedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

export interface KeyVals {
  [key: string]: any;
}

export enum RegexType {
  Alphanumeric = 'alphanumeric',
  LeadingHashtag = 'leading-hashtag',
  Name = 'name',
  Email = 'email',
  DayDate = 'day-date',
}
