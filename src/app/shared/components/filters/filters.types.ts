import { Subject } from 'rxjs';

export type FilterSelectOption = {
  label: string;
  value: any;
};

export interface ShFilterValueChange {
  name: string;
  value: any;
}

export interface FilterInfor {
  name: string;
  label: string;
  type: 'select' | 'input' | 'rangeDate' | 'buttonToggle';
  style?: { [key: string]: any };
  options?: FilterSelectOption[] | Subject<FilterSelectOption[]>;
  class?: string;
  value?: any;
  suffix?: string;
  clear?: boolean;
  selectConfig?: {
    openedChange(open: boolean): void;
  };
}

export type ShFilterField = {
  name: string;
  label: string;
  type: 'select' | 'input' | 'rangeDate' | 'buttonToggle';
  style?: { [key: string]: any };
  options?: FilterSelectOption[] | Subject<FilterSelectOption[]>;
  class?: string;
  value?: any;
  suffix?: string;
  clear?: boolean;
  selectConfig?: {
    openedChange(open: boolean): void;
  };
};
