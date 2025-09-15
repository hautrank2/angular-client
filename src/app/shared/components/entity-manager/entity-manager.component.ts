import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { API_REPONSE_BASE } from '~/app/types/query';
import { FormService } from '../../services/form.service';
import { ShFormField } from '../form/form.types';
import {
  ShColumn,
  ShPaginationEmit,
  ShTableAction,
} from '../table/table.types';
import {
  ShEntityAction,
  ShEntityFilter,
  ShEntityResponse,
} from './entity-manager.types';
import { EntityFormComponent } from '../entity-form/entity-form.component';
import { catchError, concat, finalize, Observable, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KEY_NAME } from '../../constants/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'sh-entity-manager',
  standalone: false,
  templateUrl: './entity-manager.component.html',
  styleUrl: './entity-manager.component.scss',
})
export class EntityManagerComponent<T extends { [key: string]: any }>
  implements OnInit, OnChanges
{
  @Input({ required: true }) entityName: string = '';
  @Input() keyName: string = KEY_NAME;
  @Input() findEntities!: (
    filters: ShEntityFilter,
  ) => Observable<ShEntityResponse<T>>;
  @Input() deleteEntity!: (id: any) => Observable<T>;
  @Input() putEntity!: (id: any, entity: T) => Observable<T>;
  @Input() postEntity!: (entity: T) => Observable<T>;

  // Table config
  @Input({ required: true }) tbColumns: ShColumn<T>[] = [];
  @Input() tbColumnsDisplay!: string[];
  @Input() tbActions: ShEntityAction[] = [];
  @Input() tbSelect: boolean = false;
  @Input() tbPagination: boolean = false;

  // Form config
  @Input() formFields!: ShFormField[];
  @Input() postFormFields!: ShFormField[];
  @Input() putFormFields!: ShFormField[];

  @Input() filterAsSearchParams: boolean = true;

  readonly dialog = inject(MatDialog);
  layout: 'grid' | 'table' = 'table';
  data = signal<ShEntityResponse<T>>(API_REPONSE_BASE);
  dataSource: T[] = [];
  filter = signal<ShEntityFilter>({ pageSize: 10, page: 1 });
  loading = signal<boolean>(false);
  form = new FormGroup({});
  selects = new SelectionModel<T>(true, []);
  private snackBar = inject(MatSnackBar);

  constructor(
    private formSrv: FormService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.formSrv.buildTableForm(this.tbColumns);
    this.form.valueChanges.subscribe((res) => {
      console.log('change form', res);
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (this.filterAsSearchParams) {
        this.filter.update((pre) => {
          return {
            ...pre,
            ...params,
          };
        });
        this.fetchData();
      }
    });

    effect(() => {
      this.dataSource = this.data().items;
      this.selects.clear();
    });
  }

  get _tbColumns(): ShColumn<T>[] {
    const result = this.tbColumns.slice();
    const actions: ShTableAction[] = [];
    this.tbActions.forEach((action) => {
      switch (action) {
        case 'edit':
          actions.push({
            label: 'Edit',
            icon: 'edit',
            onClick: (_, item) => {
              this.openDialog(item);
            },
          });
          break;
        case 'delete':
          actions.push({
            label: 'Delete',
            icon: 'delete',
            onClick: (_, item) => {
              this.remove(item);
            },
          });
          break;
      }
    });
    if (actions.length > 0) {
      result.push({ key: 'action', label: '', type: 'actions', actions });
    }
    return result;
  }

  get defaultDisplayColumns(): string[] {
    return this._tbColumns.map((e) => e.key);
  }

  get _formFields(): ShFormField[] {
    return (
      this.formFields ||
      this.formSrv.convertTableColsToFormField(this.tbColumns)
    );
  }

  get _putFormFields(): ShFormField[] {
    return this.putFormFields || this._formFields;
  }

  get _postFormFields(): ShFormField[] {
    return this.postFormFields || this._formFields;
  }

  get displayColumns(): string[] {
    return this.tbColumnsDisplay || this._tbColumns.map((col) => col.key);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  private fetchData() {
    // this.findEntities: nullable
    if (this.findEntities) {
      this.findEntities(this.filter()).subscribe((res) => {
        this.data.set(res);
        if (res.items.length === 0) {
          const maxPage = Math.ceil(res.total / this.filter().pageSize);
          if (maxPage > 0 && this.filter().page > maxPage) {
            this.filter().page = maxPage;
            this.fetchData();
          }
        }
      });
    }
  }

  changePagination(pagination: ShPaginationEmit) {
    if (this.filterAsSearchParams) {
      this.router.navigate([], {
        queryParams: pagination,
        queryParamsHandling: 'merge',
      });
    } else {
      this.filter.update((e) => ({
        ...e,
        ...pagination,
      }));
      this.fetchData();
    }
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
          formFields: isEdit ? this._putFormFields : this._postFormFields,
          putEntity: this.putEntity,
          postEntity: this.postEntity,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.fetchData();
          this.snackBar.open(
            `${isEdit ? 'Edit' : 'Add'} successfully`,
            'Close',
            { duration: 2000 },
          );
        }
      });
  }

  remove(item: T) {
    this.deleteEntity(item[this.keyName]).subscribe(() => {
      this.fetchData();
    });
  }

  scrollBottom() {}

  deleteSelected() {
    const successItems: any[] = [];
    const failItems: any[] = [];
    const deleteObservables = this.selects.selected.map((item) =>
      this.deleteEntity(item[this.keyName]).pipe(
        tap((e) => {
          successItems.push(e[this.keyName]);
        }),
        catchError((e) => {
          failItems.push(e[this.keyName]);
          return of(null);
        }),
      ),
    );

    concat(...deleteObservables)
      .pipe(
        finalize(() => {
          if (successItems.length > 0) {
            this.snackBar.open(
              `Delete successfully: ${successItems.join(', ')}`,
              'Close',
            );
          }
          if (failItems.length > 0) {
            this.snackBar.open(
              `Delete failed: ${failItems.join(', ')}`,
              'Close',
            );
          }

          this.fetchData();
          this.selects.clear();
        }),
      )
      .subscribe();
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
