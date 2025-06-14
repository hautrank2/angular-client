import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ShColumn, ShPagination } from './table.types';
import { ScrollDirective } from '../../directives/scroll.directive';
import { FormService } from '../../services/form.service';
import { ShFormField } from '../form/form.types';

@Component({
  selector: 'sh-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: false,
})
export class TableComponent<T> implements OnInit, OnChanges, AfterContentInit {
  @Input() keyIndex!: string;
  @Input() data: any[] = [];
  @Input() columns: ShColumn[] = [];
  @Input() customCells!: { [key: string]: TemplateRef<any> };
  @Input() isLoading: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() z: number | string = 0;
  @Input() height!: number | string;
  @Input() maxHeight!: number | string;
  @Input() formGroup!: FormGroup;
  isForm: boolean = true;

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
  @Output() changePagination = new EventEmitter<{
    pageSize: number;
    page: number;
  }>();

  // Select
  @Input() isSelect: boolean = false;
  @Output() changeSelect = new EventEmitter<any[]>();
  @Input() defaultSelects: T[] = [];
  @Input() disabledIndexRows: number[] = [];
  selection = new SelectionModel<any>(true, []);

  // Panel Actions
  @Output() reload = new EventEmitter<void>();
  @Input() hiddenPanel: boolean = false;
  hasFilterOrActions: boolean = false;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  // Form
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

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private formSrv: FormService,
  ) {}

  //#region Hooks
  ngOnInit(): void {
    const tempColumns = this.columns.map((column) => column.key);
    if (this.isSelect) {
      tempColumns.unshift('select');
    }
    this.displayedColumns = tempColumns;
    if (this.isEdit) this.displayedColumns.push('isEdit');

    if (!this.formGroup) {
      if (this.isForm) {
        this.formGroup = this.formSrv.buildTableForm(this.columns);
      }
    }
  }

  ngOnChanges(changes: any): void {
    if (changes['columns']) {
      this.displayedColumns = this.columns.map((column) => column.key);
    }

    if (changes['data']) {
      if (this.data) {
        this.cdr.detectChanges();
        this.initForm();
      }
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
  //#endregion

  //#region Pagination
  get realPagination(): ShPagination {
    return {
      ...(this.pagination || {}),
      page: this.pagination.page,
    };
  }

  onChangePage(value: any): void {
    let { pageSize, page } = value;
    page += 1;
    this.pagination['page'] = page;
    this.routerNavigate(page, pageSize);
  }

  routerNavigate(page: number, pageSize: number): void {
    this.changePagination.emit({ pageSize, page });
  }
  //#endregion

  //#region form
  get formFields(): ShFormField[] {
    return this.columns.map((col) =>
      this.formSrv.convertTableColToFormField(col),
    );
  }

  private initForm() {
    this.formGroup = this.fb.group({
      rows: this.fb.array(this.data.map((row) => this.createRowGroup(row))),
    });
    this.dataSource = new MatTableDataSource(this.data);

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

  onRowClick(row: any) {
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

  //#region select
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
      ...this.dataSource.data.filter(
        (_, index: number) => !this.disabledIndexRows?.includes(index),
      ),
    );
    this.emitSelectedRows();
  }

  toggleRow(e: any) {
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
  //#endregion
}
