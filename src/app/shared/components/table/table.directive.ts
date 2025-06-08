import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({ selector: '[tableDirective]', standalone: false })
export class TableDirective
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  private tableWrapperEl!: HTMLElement;
  private loadingWrapperEl!: HTMLElement;
  private scrollEventListener!: () => void;

  @Input() shTableSize: 'small' | 'medium' | 'large' = 'medium';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableSize']) {
      this.updateTableSize(this.shTableSize);
    }
  }

  ngAfterViewInit(): void {
    this.tableWrapperEl = this.el.nativeElement.querySelector('.table-wrapper');

    // Hanlde scroll position loading
    if (this.tableWrapperEl) {
      this.loadingWrapperEl = this.el.nativeElement.querySelector(
        '.table-loading-wrapper'
      );

      if (this.loadingWrapperEl) {
        this.hanldeScroll();
        this.scrollEventListener = this.renderer.listen(
          this.tableWrapperEl,
          'scroll',
          (event: Event) => {
            this.hanldeScroll();
          }
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this.scrollEventListener) this.scrollEventListener(); // Hủy đăng ký sự kiện để tránh memory leak
  }

  private updateTableSize(size: 'small' | 'medium' | 'large') {
    // First, remove all potential size classes
    this.renderer.removeClass(this.el.nativeElement, 'table-small');
    this.renderer.removeClass(this.el.nativeElement, 'table-medium');
    this.renderer.removeClass(this.el.nativeElement, 'table-large');

    // Then, add the appropriate class based on the size
    this.renderer.addClass(this.el.nativeElement, `table-${size}`);
  }

  private hanldeScroll() {
    // if (this.loadingWrapperEl && this.tableWrapperEl) {
    //   const left = this.tableWrapperEl.scrollLeft;
    //   const top = this.tableWrapperEl.scrollTop;
    //   this.renderer.setStyle(
    //     this.loadingWrapperEl,
    //     'transform',
    //     `translate(${left}px, ${top}px)`
    //   );
    // }
  }
}
