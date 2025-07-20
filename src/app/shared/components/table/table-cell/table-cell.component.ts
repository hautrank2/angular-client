import {
  Component,
  DoCheck,
  Injector,
  Input,
  OnChanges,
  PipeTransform,
  SimpleChanges,
  TemplateRef,
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
  @Input() column!: ShColumn;
  @Input() form: FormGroup = new FormGroup({});
  @Input() rowIndex: number = 0;
  @Input({ required: true }) row!: T;
  @Input() customCells!: { [key: string]: TemplateRef<any> };
  @Input() isForm = false;
  constructor(private injector: Injector) {}

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngDoCheck(): void {}

  get cellValue() {
    if (this.isForm) {
      return this.getFormControl(this.rowIndex, this.column.key);
    }
    return (this.row as Record<string, any>)[this.column.key];
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
}
