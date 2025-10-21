import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appTypography]',
  standalone: false,
})
export class TypographyDirective implements OnChanges {
  @Input('appTypography') variant: TypogoraphyFont = 'body-md';
  @Input() color: string = 'text-foreground';
  @Input() fontWeight!: string | number;
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() extraClass: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // this.applyClasses();
    this.applyStyle();

    if (changes['fontWeight'] && this.fontWeight) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'fontWeight',
        this.fontWeight,
      );
    }
  }

  private applyClasses(): void {
    const baseClasses = [
      this.extraClass,
      this.color,
      this.fontWeight,
      `text-${this.align}`,
      // this.mapVariantToFontSize(this.variant),
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    this.renderer.setAttribute(this.el.nativeElement, 'class', baseClasses);
  }

  private applyStyle() {
    const font = TypographyMap[this.variant];
    this.renderer.setStyle(
      this.el.nativeElement,
      'font',
      `var(${font.cssVar})`,
    );
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
        return 'text-base font-md';
      case 'p':
        return 'text-base';
      case 'sm':
        return 'text-sm';
      default:
        return 'text-base';
    }
  }
}

export type TypogoraphyFont =
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'headline-lg'
  | 'headline-md'
  | 'headline-sm'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'title-lg'
  | 'title-md'
  | 'title-sm';

export type Md3Font =
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small';

const TypographyMap: Record<
  TypogoraphyFont,
  {
    md3: Md3Font;
    cssVar: string;
  }
> = {
  'body-lg': { md3: 'body-large', cssVar: '--mat-sys-body-large' },
  'body-md': { md3: 'body-medium', cssVar: '--mat-sys-body-medium' },
  'body-sm': { md3: 'body-small', cssVar: '--mat-sys-body-small' },

  'display-lg': { md3: 'display-large', cssVar: '--mat-sys-display-large' },
  'display-md': { md3: 'display-medium', cssVar: '--mat-sys-display-medium' },
  'display-sm': { md3: 'display-small', cssVar: '--mat-sys-display-small' },

  'headline-lg': { md3: 'headline-large', cssVar: '--mat-sys-headline-large' },
  'headline-md': {
    md3: 'headline-medium',
    cssVar: '--mat-sys-headline-medium',
  },
  'headline-sm': { md3: 'headline-small', cssVar: '--mat-sys-headline-small' },

  'label-lg': { md3: 'label-large', cssVar: '--mat-sys-label-large' },
  'label-md': { md3: 'label-medium', cssVar: '--mat-sys-label-medium' },
  'label-sm': { md3: 'label-small', cssVar: '--mat-sys-label-small' },

  'title-lg': { md3: 'title-large', cssVar: '--mat-sys-title-large' },
  'title-md': { md3: 'title-medium', cssVar: '--mat-sys-title-medium' },
  'title-sm': { md3: 'title-small', cssVar: '--mat-sys-title-small' },
};
