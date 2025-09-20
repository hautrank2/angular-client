import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SH_DEFAULT_FORM_OPTIONS, ShFormOptions } from '../form/form.types';
@Component({
  selector: 'sh-date-time',
  standalone: false,
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true,
    },
  ],
})
export class DateTimeComponent implements ControlValueAccessor, OnChanges {
  @Input() formOptions: ShFormOptions = SH_DEFAULT_FORM_OPTIONS;
  @Input() label: string = 'Date & Time';
  @Input() value: string | null = null;
  @Output() valueChange = new EventEmitter<string | null>();

  inputValue: Date | null = null;

  ngOnChanges(): void {
    console.log(this.value);
  }

  private onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.inputValue = value ? new Date(value) : null;
    console.log(this.inputValue, value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // optional: disable UI nếu cần
  }

  updateValue() {
    if (!this.inputValue) {
      this.onChange(null);
      this.valueChange.emit(null);
      return;
    }

    // xuất ra ISO string
    const iso = this.inputValue.toISOString();
    this.onChange(iso);
    this.valueChange.emit(iso);
  }
}
