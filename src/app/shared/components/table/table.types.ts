export interface ShPagination {
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
}

// Shared base interface
interface BaseColumn {
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
}

// 1. Text column
export interface TextColumn extends BaseColumn {
  type: 'text';
  formatter?(value: any, item: any, index: number): any;
}

// 2. Number column
export interface NumberColumn extends BaseColumn {
  type: 'number';
}

// 3. Date column
export interface DateColumn extends BaseColumn {
  type: 'date';
}

// 4. IconText column
export interface IconTextColumn extends BaseColumn {
  type: 'iconText';
  icon?: ShIconConfig;
  actionConfig?: ShActionConfig;
}

// 5. Status column
export interface StatusColumn extends BaseColumn {
  type: 'status';
  getConfig(arg: any): { iconName: string; color?: string; label: string };
}

// 6. StatusList column
export interface StatusListColumn extends BaseColumn {
  type: 'statusList';
  statusData: ShStatusConfig;
}

// 7. Select column
export interface SelectColumn extends BaseColumn {
  type: 'select';
  options: ShOption[];
}

// 8. Toggle column
export interface ToggleColumn extends BaseColumn {
  type: 'toggle';
}

// 9. Radio column
export interface RadioColumn extends BaseColumn {
  type: 'radio';
}

// 10. Custom column
export interface CustomColumn extends BaseColumn {
  type: 'custom';
}

// 11. Time column
export interface TimeColumn extends BaseColumn {
  type: 'time';
}

// 12. Actions column (multiple actions)
export interface ActionColumn extends BaseColumn {
  type: 'actions';
  actionType?: 'menu' | 'list';
  iconName?: string;
  actions: ShTableAction[];
}

// 🔀 Union type: dùng cho input hoặc cấu hình bảng
export type ShColumn =
  | TextColumn
  | NumberColumn
  | DateColumn
  | IconTextColumn
  | StatusColumn
  | StatusListColumn
  | SelectColumn
  | ToggleColumn
  | RadioColumn
  | CustomColumn
  | TimeColumn
  | ActionColumn;

export interface ShOption {
  label: string;
  value: any;
}

export interface ShTableAction {
  label: string;
  icon: string;
  type: string | 'btn';
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
