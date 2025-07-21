import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[shZ]',
  standalone: false,
})
export class ZDirective implements OnChanges {
  @Input() shZ: number | string = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shZ']) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'box-shadow',
        `var(--mat-sys-level${this.shZ})`,
      );
    }
  }
}
