import {
  Component,
  Injector,
  Input,
  PipeTransform,
  TemplateRef,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ShColumn } from '../table.types';

@Component({
  selector: 'sh-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  standalone: false,
})
export class TableCellComponent {
  @Input() column!: ShColumn;
  @Input() form: FormGroup = new FormGroup({});
  @Input() rowIndex: number = 0;
  @Input() row: any;
  @Input() customCells!: { [key: string]: TemplateRef<any> };
  constructor(private injector: Injector) {}

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
  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  getFormControl(rowIndex: number, controlName: string) {
    return (this.rows.at(rowIndex) as FormGroup).get(
      controlName
    ) as FormControl;
  }
  //#endregion

  //#endregion PIPE
  transformValue(
    value: any,
    pipe: { name: string; props?: Record<string, any> }
  ): any {
    if (pipe.name) {
      const pipeInstance = this.injector.get<PipeTransform>(
        this.getPipeClass(pipe.name)
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
