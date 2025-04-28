import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appTypography]',
  standalone: true,
})
export class TypographyDirective implements OnChanges {
  @Input('appTypography') variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span' = 'p';
  @Input() color: string = 'text-black';
  @Input() fontWeight: string = 'font-normal';
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() extraClass: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.applyClasses();
  }

  private applyClasses(): void {
    const baseClasses = [
      this.color,
      this.fontWeight,
      `text-${this.align}`,
      this.mapVariantToFontSize(this.variant),
      this.extraClass,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    this.renderer.setAttribute(this.el.nativeElement, 'class', baseClasses);
  }

  private mapVariantToFontSize(variant: string): string {
    switch (variant) {
      case 'h1':
        return 'text-4xl';
      case 'h2':
        return 'text-3xl';
      case 'h3':
        return 'text-2xl';
      case 'h4':
        return 'text-xl';
      case 'h5':
        return 'text-lg';
      case 'h6':
        return 'text-base';
      case 'p':
        return 'text-base';
      case 'span':
        return 'text-sm';
      default:
        return 'text-base';
    }
  }
}
