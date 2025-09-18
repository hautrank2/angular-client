import {
  Component,
  DoCheck,
  effect,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  PipeTransform,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ShColumn } from '../table.types';

@Component({
  selector: 'sh-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class TableCellComponent<T> implements OnChanges, DoCheck {
  @Input() column!: ShColumn<T>;
  @Input() form: FormGroup = new FormGroup({});
  @Input() rowIndex: number = 0;
  @Input({ required: true }) row!: T;
  @Input() customCells!: { [key: string]: TemplateRef<any> };
  @Input() isForm = false;

  openEditorPopover = signal(false);
  editFormControl = new FormControl('');
  @ViewChild('popoverInput') popoverInput?: ElementRef<HTMLInputElement>;

  constructor(private injector: Injector) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngDoCheck(): void {}

  get cellValue() {
    const value = this.isForm
      ? this.getFormControl(this.rowIndex, this.column.key).value
      : (this.row as Record<string, any>)[this.column.key];
    if (this.column.render) {
      return this.column.render(value, this.row, this.rowIndex);
    }
    return value;
  }

  get fc(): FormControl | null {
    if (!this.isForm || !this.rows) return null;
    return (this.rows.at(this.rowIndex) as FormGroup).get(
      this.column.key,
    ) as FormControl;
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
  readonly popoverTypes = ['text', 'number'];
  tableCellClick(event: MouseEvent) {
    if (
      this.isForm &&
      !!this.fc &&
      this.popoverTypes.includes(this.column.type)
    ) {
      this.openEditorPopover.set(true);
      this.editFormControl.setValue(this.cellValue);
    }
  }

  closePopover(ok?: boolean) {
    if (!this.openEditorPopover || !this.fc) return;
    if (!ok) {
      this.openEditorPopover.set(false);
      return;
    }
    const value = this.editFormControl.value;
    this.fc.setValue(value);
    this.openEditorPopover.set(false);
  }
  //#endregion
}
