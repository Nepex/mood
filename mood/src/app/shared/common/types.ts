import { QueryOperator } from '@core';

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

export interface NameValPair {
  name: string;
  value: string;
}

export interface KeyValPairs {
  [key: string]: string | boolean | number;
}

export type SortOpts<T> = {
  field: keyof T;
  order: 'ASC' | 'DESC';
};

export type FilterOpts<T> = {
  [key in keyof T | `${QueryOperator}${string & keyof T}`]?: any;
};

export interface FilterQueryOpts<T> {
  filters: FilterOpts<Partial<T>> | FilterOpts<Partial<T>>[];
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
  isSquished: boolean;
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
}

export enum Theme {
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

// Menus
export interface MenuItem {
  label: string;
  icon?: string;
  innerMenu?: MenuItem[];
  routerLink?: string;
  url?: string;
  queryParams?: KeyValPairs;
  active?: boolean;
}

export interface MenuItemAction {
  menuAction: MenuAction;
  menuItem: MenuItem;
}

export enum MenuAction {
  Select = 'select',
  Void = 'void',
}

export enum MenuToggleDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export enum LinearMenuToggleDirection {
  Next = 'next',
  Prev = 'previous',
}

export enum MenuOrientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum MenuKey {
  W = 'KeyW',
  A = 'KeyA',
  S = 'KeyS',
  D = 'KeyD',
  Enter = 'Enter',
}

export enum HorizontalMenuKey {
  A = 'KeyA',
  D = 'KeyD',
  Enter = 'Enter',
}

export enum VerticalMenuKey {
  W = 'KeyW',
  S = 'KeyS',
  Enter = 'Enter',
}

// Game
export interface AppearancePreviewPiece {
  key: string;
  imgPath: string;
  zIndex: number;
  color?: string;
}
