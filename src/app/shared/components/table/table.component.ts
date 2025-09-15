import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  ShColumn,
  ShPagination,
  ShPaginationEmit,
  ShTableSelect,
} from './table.types';
import { ScrollDirective } from '../../directives/scroll.directive';
import { FormService } from '../../services/form.service';
import { ShFormField } from '../form/form.types';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { KEY_NAME } from '../../constants/common';

@Component({
  selector: 'sh-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: false,
})
export class TableComponent<T> implements OnInit, OnChanges, AfterContentInit {
  @Input() keyName: string = KEY_NAME;
  @Input() data: T[] = [];
  @Input() columns: ShColumn<T>[] = [];
  columnData = signal<ShColumn<T>[]>([]);
  @Input() customCells!: { [key: string]: TemplateRef<any> };
  @Input() isLoading: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() z: number | string = 0;
  @Input() height!: number | string;
  @Input() maxHeight!: number | string;
  @Input() formGroup!: FormGroup;
  @Input() isForm: boolean = false;

  // Style
  @Input() tableStyle: Record<string, any> = {};

  // Start ROW:
  @Input() disableRow: boolean = false;
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowDbClick = new EventEmitter<any>();

  // Header
  @Input() headerSticky: boolean = false;

  // Footer
  @Input() hasFooter: boolean = false;

  // Pagination
  @Input() pagination!: ShPagination;
  @Output() changePagination = new EventEmitter<ShPaginationEmit>();

  // Select
  readonly selectName = 'SELECT_NAME';
  @Input() isSelect: boolean = false;
  @Output() changeSelect = new EventEmitter<ShTableSelect[]>();
  @Input() disabledIndexRows: number[] = [];
  @Input() defaultSelects: ShTableSelect[] = [];
  @Input() selection = new SelectionModel<ShTableSelect>(true, []);

  // Number column
  readonly countName = 'COUNT_NAME';
  @Input() hasColumnCount = false;

  // Panel Actions
  @Output() reload = new EventEmitter<void>();
  @Input() hiddenPanel: boolean = false;
  hasFilterOrActions: boolean = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  // Form
  readonly editName = 'EDIT_NAME';
  @Input() isEdit: boolean = false;
  @Output() valueChanges = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<{ index: number; data: any }>();
  @Output() submit = new EventEmitter<any>();

  // Scroll
  isOnBottom: boolean = false;
  previousScrollTop!: number;
  @Output() onScrollBottom = new EventEmitter<number>();
  @Output() onScrollTop = new EventEmitter<number>();
  @ViewChild('scrollDir') scrollDir!: ScrollDirective;

  //Sort
  @Input() sortData: Sort | undefined;
  @Output() onSort = new EventEmitter<Sort>();

  // Panel
  @Input({ required: true }) defaultDisplayColumns: string[] = [];
  @Input() hasPanel: boolean = false;
  @Input() hasColumnFilter: boolean = false;
  @Output() onDeleteSelected = new EventEmitter<ShTableSelect[]>();
  displayColumns = new SelectionModel<string>(true, []);

  @HostBinding('style.position') @Input() position: string = 'relative';

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private formSrv: FormService,
  ) {
    this.columnData.set(this.columns);
  }

  //#region Hooks
  ngOnInit(): void {
    if (!this.formGroup) {
      if (this.isForm) {
        this.formGroup = this.formSrv.buildTableForm(this.columns);
      }
    }

    this.displayColumns.setSelection(
      ...(this.defaultDisplayColumns
        ? this.defaultDisplayColumns
            .slice()
            .filter((e) => this.canFilterColumnKeys.includes(e))
        : this.canFilterColumnKeys),
    );
  }

  ngOnChanges(changes: any): void {
    if (changes['data']) {
      if (this.data) {
        this.cdr.detectChanges();
        this.initForm();
      }
    }

    if (changes['columns']) {
      this.columnData.set(changes['columns'].currentValue);
    }

    if (changes['defaultSelects']) {
      this.selection.clear();
      this.selection.select(...(this.defaultSelects || []));
    }

    if (changes['isLoading']) {
    }

    if (changes['disabledIndexRows']) {
    }

    if (changes['isEdit']) {
      if (this.isEdit) this.displayedColumns.push('isEdit');
    }

    if (changes['defaultDisplayColumns']) {
      this.displayColumns.setSelection(
        ...(this.defaultDisplayColumns
          ? this.defaultDisplayColumns
              .slice()
              .filter((e) => this.canFilterColumnKeys.includes(e))
          : this.canFilterColumnKeys),
      );
    }
  }

  get isFixedHeight() {
    return !!this.maxHeight || !!this.height;
  }

  get displayedColumns(): string[] {
    // Lọc theo đúng thứ tự this.columns
    const colKeys = this.columns
      .filter((c) => c.lock || this.displayColumns.isSelected(c.key))
      .map((c) => c.key);

    // Pinned trái (giữ đúng thứ tự bạn muốn xuất hiện từ trái sang phải)
    const left: string[] = [];
    // Ví dụ muốn COUNT ngoài cùng trái rồi tới SELECT:
    if (this.hasColumnCount && !colKeys.includes(this.countName))
      left.push(this.countName);
    if (this.isSelect && !colKeys.includes(this.selectName))
      left.push(this.selectName);

    // Pinned phải
    const right: string[] = [];
    if (this.isEdit && !colKeys.includes(this.editName))
      right.push(this.editName);

    return [...left, ...colKeys, ...right];
  }

  ngDoCheck() {}

  ngAfterContentInit(): void {
    // Kiểm tra: trong Panel có tồn tại Filters và Actions, nếu không ẩn luôn
    const tablePanel = this.elRef.nativeElement.querySelector('.table-panel');
    if (tablePanel) {
      const hasTableFilters =
        tablePanel.querySelector('[table-filters]') !== null;
      const hasTableActions =
        tablePanel.querySelector('[table-actions]') !== null;
      this.hasFilterOrActions = hasTableActions || hasTableFilters;
    }
  }

  getTemplate(key: string): TemplateRef<any> | null {
    return this.customCells[key] || null;
  }

  getNumberCount(index: number): number {
    // Check pagination
    if (this.pagination) {
      return (this.pagination.page - 1) * this.pagination.pageSize + index + 1;
    }
    return index;
  }
  //#endregion

  //#region Pagination
  onChangePage(value: PageEvent): void {
    let { pageSize, pageIndex } = value;
    pageIndex += 1;
    this.pagination['page'] = pageIndex;
    this.routerNavigate(pageIndex, pageSize);
  }

  routerNavigate(pageIndex: number, pageSize: number): void {
    this.changePagination.emit({ pageSize, pageIndex });
  }
  //#endregion

  //#region form
  get formFields(): ShFormField[] {
    return this.columns.map((col) =>
      this.formSrv.convertTableColToFormField(col),
    );
  }

  private initForm() {
    this.dataSource = new MatTableDataSource(this.data);

    if (!this.isForm) return;
    this.formGroup = this.fb.group({
      rows: this.fb.array(this.data.map((row) => this.createRowGroup(row))),
    });

    this.formGroup.valueChanges.subscribe((res) => {
      this.valueChanges.emit(res.rows);
    });

    (this.formGroup.get('rows') as FormArray)?.controls.forEach(
      (control, index) => {
        control.valueChanges.subscribe((data) => {
          this.valueChange.emit({ index, data });
        });
      },
    );
  }

  createRowGroup(data: any): FormGroup {
    const group: { [key: string]: any } = {};

    this.columns.forEach((column) => {
      const value = data[column.key];

      // Handle different types of data
      if (Array.isArray(value)) {
        if (typeof value[0] === 'object') {
          // Array of objects: create a FormArray of FormGroups
          group[column.key] = this.fb.array(
            value.map((item: any) =>
              this.fb.group(this.mapObjectToControls(item)),
            ),
          );
        } else {
          // Array of primitive values: create a FormArray
          group[column.key] = this.fb.array(value || []);
        }
      } else if (typeof value === 'object' && value !== null) {
        // Single object: create a nested FormGroup
        group[column.key] = this.fb.group(this.mapObjectToControls(value));
      } else {
        // Primitive value: create a simple FormControl
        group[column.key] = [value];
      }
    });

    return this.fb.group(group);
  }

  mapObjectToControls(obj: any): { [key: string]: any } {
    const controls: { [key: string]: any } = {};
    Object.keys(obj).forEach((key) => {
      controls[key] = [obj[key]];
    });
    return controls;
  }

  //#endregion

  //#region utility
  isDisabledRow(index: number): boolean {
    return !this.disableRow && !this.disabledIndexRows.includes(index);
  }

  onReload() {
    this.reload.emit();
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }

  onRowDoubleClick(row: any) {
    this.rowDbClick.emit(row);
  }

  getFormData(): any {
    return this.formGroup.value;
  }

  onSave() {
    this.submit.emit(this.getFormData()['rows']);
  }

  onReset() {
    this.initForm();
  }
  //#endregion

  //#region Scroll
  onScroll(scrollTop: number): void {
    const element = this.scrollDir.elRef.nativeElement;
    const threshold = 200;
    const atBottom =
      element.scrollHeight - element.scrollTop <=
      element.clientHeight + threshold;
    const atTop = element.scrollTop <= 20;
    if (atBottom) {
      this.onScrollBottom.emit(element.clientHeight);
      this.isOnBottom = true;
      return;
      // You can trigger more actions, like loading more data, etc.
    }

    if (this.isOnBottom && atTop) {
      this.previousScrollTop = element.scrollTop;
      this.onScrollTop.emit(element.clientHeight);
    }
  }

  setScrollTop() {
    const element = this.scrollDir.elRef.nativeElement;
    if (element) {
      this.renderer.setProperty(element, 'scrollTop', 40);
    }
  }
  //#endregion

  //#region Sort
  sort(sort: Sort) {
    this.onSort.emit(sort);
  }
  //#endregion

  //#region select
  getSelection() {
    return this.selection;
  }

  isAllSelected() {
    return (
      this.selection.selected.length ===
      this.dataSource.data.length - (this.disabledIndexRows?.length || 0)
    );
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.emitSelectedRows();
      return;
    }

    this.selection.select(
      ...this.dataSource.data
        .filter((_, index: number) => !this.disabledIndexRows?.includes(index))
        .map((e) => e[this.keyName]),
    );
    this.emitSelectedRows();
  }

  toggleRow(e: ShTableSelect) {
    this.selection.toggle(e);
    this.emitSelectedRows();
  }

  emitSelectedRows() {
    const selectedRows = this.selection.selected;
    this.changeSelect.emit(selectedRows);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  clearSelect() {
    this.selection.clear();
    this.emitSelectedRows();
  }

  //#endregion

  //#region Filter column
  get canFilterColumnKeys(): string[] {
    return this.columns.filter((e) => !e.lock).map((e) => e.key);
  }

  get isIndeterminateFilterColumn(): boolean {
    return (
      !this.canFilterColumnKeys.every((e) =>
        this.displayColumns.isSelected(e),
      ) && this.displayColumns.hasValue()
    );
  }

  get isAllFilterColumn(): boolean {
    return (
      this.displayColumns.hasValue() &&
      this.canFilterColumnKeys.every((e) => this.displayColumns.isSelected(e))
    );
  }

  toggleAllColumnFilter(checked: boolean) {
    if (checked) {
      this.displayColumns.setSelection(...this.canFilterColumnKeys);
    } else {
      this.displayColumns.clear();
    }
  }

  isShownColumn(key: string) {
    return this.displayColumns.isSelected(key);
  }

  toggleColumnFilter(key: string) {
    this.displayColumns.toggle(key);
  }
  //#endregion

  //#region Panel
  deleteSelected() {
    this.onDeleteSelected.emit(this.selection.selected);
  }
  //#endregion
}
