import { BasePagination } from '../../types/pagination';
import { ShFormField } from '../form/form.types';

export type ShTableSelect = string | number;

export type ShPagination = BasePagination;
// Shared base
export type ShBaseColumn<T> = {
  name: string;
  label: string;
  sortable?: boolean;
  width?: number;
  props?: Record<string, any>;
  onChange?(value: any, item: T, index: number): void;
  sticky?: boolean;
  stickyEnd?: boolean;
  render?: (value: any, item: T, index: number) => void;
  lock?: boolean;
  disabled?: boolean;
  formField?: ShFormField;
};

// 1. Text column
export type ShTextColumn<T> = ShBaseColumn<T> & {
  type: 'text';
  formatter?(value: any, item: T, index: number): any;
};

// 2. Number column
export type ShNumberColumn<T> = ShBaseColumn<T> & {
  type: 'number';
};

// 3. Date column
export type ShDateColumn<T> = ShBaseColumn<T> & {
  type: 'date' | 'dateTime';
};

// 5. Status column
export type ShStatusColumn<T> = ShBaseColumn<T> & {
  type: 'status';
  getConfig(arg: any): { iconName: string; color?: string; label: string };
};

// 7. Select column
export type ShSelectColumn<T> = ShBaseColumn<T> & {
  type: 'select';
  options: ShOption[];
};

// 8. Toggle column
export type ShToggleColumn<T> = ShBaseColumn<T> & {
  type: 'toggle';
};

// 9. Radio column
export type ShRadioColumn<T> = ShBaseColumn<T> & {
  type: 'radio';
  options: ShOption[];
};

// 10. Custom column
export type ShCustomColumn<T> = ShBaseColumn<T> & {
  type: 'custom';
};

// 11. Time column
export type ShTimeColumn<T> = ShBaseColumn<T> & {
  type: 'time';
};

// 12. Img/Avatar column
export type ShImgColumn<T> = ShBaseColumn<T> & {
  type: 'img';
};

export type ShImgsColumn<T> = ShBaseColumn<T> & {
  type: 'imgs';
};

export type ShChipColumn<T> = ShBaseColumn<T> & {
  type: 'chips';
};

export type ShAvatarGroupColumn<T> = ShBaseColumn<T> & {
  type: 'avatarGroup';
};

// 14. Actions column
export type ShActionColumn<T> = ShBaseColumn<T> & {
  type: 'actions';
  actionType?: 'menu' | 'list';
  iconName?: string;
  actions: ShTableAction[];
};

// 🔀 Union type
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
  | ShImgsColumn<T>
  | ShAvatarGroupColumn<T>
  | ShActionColumn<T>;

export type ShOption = {
  label: string;
  value: any;
};

export type ShTableAction = {
  label: string;
  icon: string;
  onClick: (value: any, item: any, index: number) => void;
};

export type ShStatusConfig = {
  getIcon?(arg: any, element: any): string;
  getClass?(arg: any, element: any): string;
  getName?(arg: any, element: any): string;
};

export type ShIconConfig = {
  name?: string;
  class?: string;
  getIcon?(arg: any): string;
  getClass?(arg: any): string;
};

export type ShActionConfig = {
  iconName: string;
  type: 'menu' | 'icon';
  menu?: {
    key: string;
    label: string;
    icon?: string;
    color?: string;
    onClick(...arg: any): any;
  }[];
};

export type ShPaginationEmit = Omit<BasePagination, 'total'>;
