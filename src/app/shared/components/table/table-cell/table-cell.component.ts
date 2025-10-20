import {
  Component,
  ElementRef,
  Injector,
  Input,
  PipeTransform,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ShColumn } from '../table.types';
import { ShFormField } from '../../form/form.types';
import { FormService } from '~/app/shared/services/form.service';

@Component({
  selector: 'sh-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class TableCellComponent<T> {
  @Input() column!: ShColumn<T>;
  @Input() form: FormGroup = new FormGroup({});
  @Input() rowIndex: number = 0;
  @Input({ required: true }) row!: T;
  @Input() customCells!: { [key: string]: TemplateRef<any> };
  @Input() isForm = false;
  @Input() rowDisabled = false;

  openEditorPopover = signal(false);
  editFormGroup = new FormGroup({});
  @ViewChild('popoverInput') popoverInput?: ElementRef<HTMLInputElement>;

  constructor(
    private injector: Injector,
    private formSrv: FormService,
  ) {}

  get cellValue() {
    const value = this.isForm
      ? this.getFormControl(this.rowIndex, this.column.name).value
      : (this.row as Record<string, any>)[this.column.name];
    if (this.column.render) {
      return this.column.render(value, this.row, this.rowIndex);
    }
    return value;
  }

  get fc(): FormControl | null {
    if (!this.isForm || !this.rows) return null;
    return (this.rows.at(this.rowIndex) as FormGroup).get(
      this.column.name,
    ) as FormControl;
  }

  get disabled(): boolean {
    return !!(this.rowDisabled || this.column.disabled);
  }
  //#region Ultility
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  //#endregion

  //#region Template
  getTemplate(key: string): TemplateRef<any> | null {
    return this.customCells[key] || null; // Return the matching template or null
  }
  //#endregion

  //#region Form
  get rows(): FormArray | null {
    if (!this.isForm) return null;
    return this.form.get('rows') as FormArray;
  }

  getFormControl(rowIndex: number, controlName: string): FormControl {
    if (!this.isForm || !this.rows) return new FormControl(this.cellValue);
    return (this.rows.at(rowIndex) as FormGroup).get(
      controlName,
    ) as FormControl;
  }

  get formField(): ShFormField {
    return {
      name: this.column.name,
      type: 'text',
      label: this.column.label,
      ...this.column.formField,
    };
  }
  //#endregion

  //#endregion PIPE
  transformValue(
    value: any,
    pipe: { name: string; props?: Record<string, any> },
  ): any {
    if (pipe.name) {
      const pipeInstance = this.injector.get<PipeTransform>(
        this.getPipeClass(pipe.name),
      );
      return pipeInstance.transform(value, pipe.props);
    }
    return value;
  }

  getPipeClass(pipeName: string): any {
    const pipes: any = {};
    return pipes[pipeName];
  }
  //#endregion

  //#region table cell edit
  readonly popoverTypes: ReadonlyArray<ShColumn<T>['type']> = [
    'text',
    'number',
    'date',
    'time',
  ];

  tableCellClick(event: MouseEvent) {
    if (
      this.isForm &&
      !!this.fc &&
      this.popoverTypes.includes(this.column.type) &&
      !this.disabled
    ) {
      this.editFormGroup = this.formSrv.buildForm([this.formField]);
      this.editFormGroup.setValue({ [this.formField.name]: this.cellValue });
      this.openEditorPopover.set(true);
    }
  }

  closePopover(ok?: boolean) {
    if (!this.openEditorPopover || !this.fc) return;
    if (!ok) {
      this.openEditorPopover.set(false);
      return;
    }
    const values = this.editFormGroup.get(this.formField.name);
    this.fc.setValue(values?.value);
    this.openEditorPopover.set(false);
  }
  //#endregion
}
