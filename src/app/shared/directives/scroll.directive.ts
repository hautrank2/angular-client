import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[shScroll]',
  exportAs: 'shScroll',
  standalone: false,
  host: {
    '(scroll)': 'onScroll($event)', // lắng nghe sự kiện scroll
  },
})
export class ScrollDirective {
  @Output() shScrollCatchBottom = new EventEmitter<number>();
  @Output() shScrollCatchTop = new EventEmitter<number>();
  @Output() shScrollCurrent = new EventEmitter<number>();

  isOnBottom = false;
  previousScrollTop!: number;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  get bot() {
    return this.el.scrollHeight - this.el.scrollTop;
  }

  get top() {
    return 0;
  }

  get elRef() {
    return this.elementRef;
  }

  get el() {
    return this.elRef.nativeElement;
  }

  //#region Scroll
  onScroll(event: any): void {
    const element = this.elRef.nativeElement;
    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight;

    this.shScrollCurrent.emit(this.el.scrollTop);

    const atTop = 0;

    if (atBottom) {
      this.shScrollCatchBottom.emit(element.clientHeight);
      this.isOnBottom = true;
      return;
      // You can trigger more actions, like loading more data, etc.
    }

    if (this.isOnBottom && atTop) {
      this.previousScrollTop = element.scrollTop;
      this.shScrollCatchTop.emit(element.clientHeight);
    }
  }

  public scroll(number: string) {
    if (this.el) {
      this.renderer.setProperty(this.el, 'scrollTop', number);
    }
  }
  //#endregion
}
