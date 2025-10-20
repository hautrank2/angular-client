import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
type DateRangeKeys = 'start' | 'end';

export type FilterSelectOption = {
  label: string;
  value: any;
};

export interface ValueChange {
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

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  standalone: false,
})
export class FiltersComponent implements OnInit, OnChanges {
  // @Input() form?: FormGroup;
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() filterInfors: FilterInfor[];
  @Input() values?: any;
  @Input() loading: boolean;
  @Input() defaultValues?: any;
  @Output() valueChanges = new EventEmitter<ValueChange>();
  @Output() valuesChanges = new EventEmitter<ValueChange[]>();

  // START: rangeDate
  rangeDate: boolean;
  tempRangeValue: { [key: string]: any } = { start: null, end: null };
  // END: rangeDate

  form: FormGroup;

  rangeDateForm = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private fb: FormBuilder,
    public datePipe: DatePipe,
  ) {
    this.form = this.fb.group({});
  }

  get hasValues(): boolean {
    let rs = false;
    if (Object.keys(this.form.value).length > 0) {
      Object.keys(this.form.value).forEach((key) => {
        if (this.form.value[key]) {
          rs = true;
        }
      });
    }
    if (Object.keys(this.rangeDateForm.value).length > 0) {
      Object.keys(this.rangeDateForm.value).forEach((key) => {
        if (this.rangeDateForm.value[key as DateRangeKeys]) {
          rs = true;
        }
      });
    }

    return rs;
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((changes) => {});
    this.tempRangeValue = { start: null, end: null };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterInfors']) {
      const filterInfors = changes['filterInfors'].currentValue;
      filterInfors.forEach((filter: FilterInfor) => {
        this.form.addControl(filter.name, this.fb.control(''));
      });

      filterInfors.forEach((config: FilterInfor) => {
        switch (config.type) {
          case 'input':
            this.form
              .get(config.name)
              ?.valueChanges.pipe(debounceTime(500)) // Wait for 300ms pause in events
              .subscribe((value) => {
                this.valueChanges.emit({ name: config.name, value });
              });
            break;
          case 'rangeDate':
            this.rangeDateForm.get('start')?.valueChanges.subscribe((value) => {
              this.tempRangeValue['start'] = this.datePipe.transform(
                value,
                'yyyy-MM-dd',
              );
              this.emitDateForm();
            });
            this.rangeDateForm.get('end')?.valueChanges.subscribe((value) => {
              this.tempRangeValue['end'] = this.datePipe.transform(
                value,
                'yyyy-MM-dd',
              );
              this.emitDateForm();
            });
            break;
          default:
            // Subscribe to other types without debounce
            this.form.get(config.name)?.valueChanges.subscribe((value) => {
              this.valueChanges.emit({ name: config.name, value });
            });
            break;
        }
      });
    }

    if (changes['values']) {
      this.form.patchValue({ ...changes['values'].currentValue });
    }

    if (changes['loading']) {
      // if (changes['loading'].currentValue) {
      //   this.rangeDateForm.disable();
      //   this.form.disable();
      // } else {
      //   this.rangeDateForm.enable();
      //   this.form.enable();
      // }
    }
  }

  emitDateForm() {
    if (this.filterInfors.find((e) => e.type === 'rangeDate')) {
      const [start, end] =
        this.filterInfors
          .find((e) => e.type === 'rangeDate')
          ?.name.split('-') || [];
      if (this.tempRangeValue['start'] && this.tempRangeValue['end']) {
        this.valuesChanges.emit([
          {
            name: start,
            value: `${this.tempRangeValue['start']} 00:00:00`,
          },
          {
            name: end,
            value: `${this.tempRangeValue['end']} 23:59:59`,
          },
        ]);
        this.tempRangeValue = {};
      } else {
        this.valuesChanges.emit([
          {
            name: start,
            value: null,
          },
          {
            name: end,
            value: null,
          },
        ]);
      }
    }
  }

  clearFilters() {
    this.form.reset(this.defaultValues || {});
    this.rangeDateForm.reset();
  }

  clearFilter(e: any, name: string) {
    e.stopPropagation();
    this.form.get(name)?.reset();
  }

  // Helper
  getOptions(options: any): Subject<FilterSelectOption[]> {
    if (options instanceof Subject) {
      return options;
    }
    return new BehaviorSubject<FilterSelectOption[]>(options || []);
  }
}
