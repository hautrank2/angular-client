export interface ShPagination {
  page: number;
  pageSize: number;
  total: number;
}

// Shared base interface
export interface ShBaseColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  pipe?: {
    name: string;
    props?: Record<string, any>;
  };
  props?: Record<string, any>;
  onChange?(value: any, item: any, index: number): void;
  sticky?: boolean;
  stickyEnd?: boolean;
}

// 1. Text column
export interface ShTextColumn extends ShBaseColumn {
  type: 'text';
  formatter?(value: any, item: any, index: number): any;
}

// 2. Number column
export interface ShNumberColumn extends ShBaseColumn {
  type: 'number';
}

// 3. Date column
export interface ShDateColumn extends ShBaseColumn {
  type: 'date';
}

// 5. Status column
export interface ShStatusColumn extends ShBaseColumn {
  type: 'status';
  getConfig(arg: any): { iconName: string; color?: string; label: string };
}

// 7. Select column
export interface ShSelectColumn extends ShBaseColumn {
  type: 'select';
  options: ShOption[];
}

// 8. Toggle column
export interface ShToggleColumn extends ShBaseColumn {
  type: 'toggle';
}

// 9. Radio column
export interface ShRadioColumn extends ShBaseColumn {
  type: 'radio';
  options: ShOption[];
}

// 10. Custom column
export interface ShCustomColumn extends ShBaseColumn {
  type: 'custom';
}

// 11. Time column
export interface ShTimeColumn extends ShBaseColumn {
  type: 'time';
}

// 12. Avatar column (multiple actions)
export interface ShImgColumn extends ShBaseColumn {
  type: 'img';
}

// 13. Chips column (multiple actions)
export interface ShChipColumn extends ShBaseColumn {
  type: 'chips';
}

// 13. Actions column (multiple actions)
export interface ShActionColumn extends ShBaseColumn {
  type: 'actions';
  actionType?: 'menu' | 'list';
  iconName?: string;
  actions: ShTableAction[];
}

// 🔀 Union type: dùng cho input hoặc cấu hình bảng
export type ShColumn =
  | ShTextColumn
  | ShNumberColumn
  | ShDateColumn
  | ShStatusColumn
  | ShSelectColumn
  | ShToggleColumn
  | ShRadioColumn
  | ShCustomColumn
  | ShTimeColumn
  | ShImgColumn
  | ShChipColumn
  | ShActionColumn;

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
  page: number;
  pageSize: number;
}
