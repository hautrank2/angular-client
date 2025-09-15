export type ShTableSelect = string | number;
export interface ShPagination {
  page: number;
  pageSize: number;
  total: number;
}
// Shared base interface
export interface ShBaseColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  pipe?: {
    name: string;
    props?: Record<string, any>;
  };
  props?: Record<string, any>;
  onChange?(value: any, item: T, index: number): void;
  sticky?: boolean;
  stickyEnd?: boolean;
  render?: (value: any, item: T, index: number) => void;
  lock?: boolean; // if true, the column cannot be hided
}

// 1. Text column
export interface ShTextColumn<T> extends ShBaseColumn<T> {
  type: 'text';
  formatter?(value: any, item: T, index: number): any;
}

// 2. Number column
export interface ShNumberColumn<T> extends ShBaseColumn<T> {
  type: 'number';
}

// 3. Date column
export interface ShDateColumn<T> extends ShBaseColumn<T> {
  type: 'date';
}

// 5. Status column
export interface ShStatusColumn<T> extends ShBaseColumn<T> {
  type: 'status';
  getConfig(arg: any): { iconName: string; color?: string; label: string };
}

// 7. Select column
export interface ShSelectColumn<T> extends ShBaseColumn<T> {
  type: 'select';
  options: ShOption[];
}

// 8. Toggle column
export interface ShToggleColumn<T> extends ShBaseColumn<T> {
  type: 'toggle';
}

// 9. Radio column
export interface ShRadioColumn<T> extends ShBaseColumn<T> {
  type: 'radio';
  options: ShOption[];
}

// 10. Custom column
export interface ShCustomColumn<T> extends ShBaseColumn<T> {
  type: 'custom';
}

// 11. Time column
export interface ShTimeColumn<T> extends ShBaseColumn<T> {
  type: 'time';
}

// 12. Avatar column
export interface ShImgColumn<T> extends ShBaseColumn<T> {
  type: 'img';
}

// 13. Chips column
export interface ShChipColumn<T> extends ShBaseColumn<T> {
  type: 'chips';
}
export interface ShAvatarGroupColumn<T> extends ShBaseColumn<T> {
  type: 'avatarGroup';
}

// 14. Actions column
export interface ShActionColumn<T> extends ShBaseColumn<T> {
  type: 'actions';
  actionType?: 'menu' | 'list';
  iconName?: string;
  actions: ShTableAction[];
}

// 🔀 Union type: dùng cho input hoặc cấu hình bảng
export type ShColumn<T> =
  | ShTextColumn<T>
  | ShNumberColumn<T>
  | ShDateColumn<T>
  | ShStatusColumn<T>
  | ShSelectColumn<T>
  | ShToggleColumn<T>
  | ShRadioColumn<T>
  | ShCustomColumn<T>
  | ShTimeColumn<T>
  | ShImgColumn<T>
  | ShChipColumn<T>
  | ShAvatarGroupColumn<T>
  | ShActionColumn<T>;

export interface ShOption {
  label: string;
  value: any;
}

export interface ShTableAction {
  label: string;
  icon: string;
  onClick: (value: any, item: any, index: number) => void;
}

export interface ShStatusConfig {
  getIcon?(arg: any, element: any): string;
  getClass?(arg: any, element: any): string;
  getName?(arg: any, element: any): string;
}

export interface ShIconConfig {
  name?: string;
  class?: string;
  getIcon?(arg: any): string;
  getClass?(arg: any): string;
}

export interface ShActionConfig {
  iconName: string;
  type: 'menu' | 'icon';
  menu?: {
    key: string;
    label: string;
    icon?: string;
    color?: string;
    onClick(...arg: any): any;
  }[];
}

export interface ShPaginationEmit {
  pageIndex: number;
  pageSize: number;
}
