import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-table-wrapper',
  standalone: false,
  templateUrl: './table-wrapper.component.html',
  styleUrl: './table-wrapper.component.scss',
})
export class TableWrapperComponent {
  @Input() isLoading: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() z: number | string = 0;
  @Input() height: any;

  // Header
  @Input() headerSticy: boolean = false;

  // Panel Actions
  @Output() reload = new EventEmitter<void>();
  @Input() hiddenPanel: boolean = false;
  hasFilterOrActions: boolean = false;

  constructor() {}

  //#region utility
  onReload() {
    this.reload.emit();
  }
  //#endregion
}
