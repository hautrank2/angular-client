import { Component, Input, signal } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import {
  FormField,
  FormOptions,
  DEFAULT_FORM_OPTIONS,
} from '../form.types';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.scss',
  standalone: false,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class InputPasswordComponent {
  @Input() field!: FormField;
  @Input() formGroup!: FormGroup;
  @Input() formOptions: FormOptions = DEFAULT_FORM_OPTIONS;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
