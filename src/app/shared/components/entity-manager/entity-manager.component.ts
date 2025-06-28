import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { API_REPONSE_BASE } from '~/app/types/query';
import { FormService } from '../../services/form.service';
import { ShFormField } from '../form/form.types';
import { ShColumn } from '../table/table.types';
import { ShEntityFilter, ShEntityResponse } from './entity-manager.types';
import { EntityFormComponent } from '../entity-form/entity-form.component';
import { catchError, concat, finalize, Observable, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KEY_NAME } from '../../constants/common';

@Component({
  selector: 'app-entity-manager',
  standalone: false,
  templateUrl: './entity-manager.component.html',
  styleUrl: './entity-manager.component.scss',
})
export class EntityManagerComponent<T extends { [key: string]: any }>
  implements OnChanges
{
  @Input({ required: true }) entityName: string = '';
  @Input({ required: true }) keyName: string = KEY_NAME;
  @Input() findEntities!: (
    filters: ShEntityFilter,
  ) => Observable<ShEntityResponse<T>>;
  @Input() deleteEntity!: (item: T) => Observable<T>;
  @Input() putEntity!: (id: any, entity: T) => Observable<T>;
  @Input() postEntity!: (entity: T) => Observable<T>;

  // Table config
  @Input({ required: true }) tbColumns: ShColumn[] = [];
  @Input() tbColumnsDisplay!: string[];

  // Form config
  @Input({ required: true }) formFields: ShFormField[] = [];
  readonly dialog = inject(MatDialog);
  layout: 'grid' | 'table' = 'table';
  displayedColumns: string[] = [
    'name',
    'description',
    'membersCount',
    'createdAt',
    'actions',
  ];
  data = signal<ShEntityResponse<T>>(API_REPONSE_BASE);
  dataSource: T[] = [];
  filter: ShEntityFilter = { pageSize: 100, page: 1, isMembers: true };
  form = new FormGroup({});
  selects = new SelectionModel<T>(true, []);
  private snackBar = inject(MatSnackBar);

  constructor(private formSrv: FormService) {
    this.form = this.formSrv.buildTableForm(this.tbColumns);
    this.form.valueChanges.subscribe((res) => {
      console.log('change form', res);
    });
    effect(() => {
      this.dataSource = this.data().items;
    });
  }

  get _formFields(): ShFormField[] {
    return this.formSrv.convertTableColsToFormField(this.tbColumns);
  }

  get displayColumns(): string[] {
    return this.tbColumnsDisplay || this.tbColumns.map((col) => col.key);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  private fetchData() {
    this.findEntities(this.filter).subscribe((res) => {
      this.data.set(res);
    });
  }

  changeLayout(event: MatButtonToggleChange) {
    this.layout = event.value;
  }

  openDialog(defaultValues?: T) {
    const isEdit = !!defaultValues;
    this.dialog
      .open(EntityFormComponent, {
        maxWidth: '60vw',
        width: '60vw',
        autoFocus: true,
        restoreFocus: true,
        data: {
          title: isEdit
            ? `Edit ${this.entityName}`
            : `Create ${this.entityName}`,
          defaultValues,
          formFields: this.formFields || this.formFields,
          putEntity: this.putEntity,
          postEntity: this.postEntity,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.fetchData();
          this.snackBar.open(`${isEdit ? 'Edit' : 'Add'} successfully`);
        }
      });
  }

  remove(item: T) {
    this.deleteEntity(item).subscribe(() => {
      this.fetchData();
    });
  }

  scrollBottom() {}

  deleteSelected() {
    const successItems: any[] = [];
    const failItems: any[] = [];
    const deleteObservables = this.selects.selected.map((item) =>
      this.deleteEntity(item).pipe(
        tap((e) => {
          successItems.push(e[this.keyName]);
        }),
        catchError((e) => {
          failItems.push(e[this.keyName]);
          return of(null);
        }),
      ),
    );

    concat(...deleteObservables).pipe(
      finalize(() => {
        if (successItems.length > 0) {
          this.snackBar.open(`Delete successfully: ${successItems.join(', ')}`);
        }
        if (failItems.length > 0) {
          this.snackBar.open(`Delete failed: ${failItems.join(', ')}`);
        }

        this.fetchData();
        this.selects.clear();
      }),
    );
  }

  //#region Selects
  changeSelect(items: T[]) {
    this.selects.clear();
    this.selects.setSelection(...items);
  }

  clearSelected() {
    this.selects.clear();
  }
  //#endregion
}
