import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { environment } from '~/environments/environment';

@Directive({
  selector: '[shImg]',
  standalone: false,
})
export class ImgDirective implements OnChanges {
  @Input() shImgSrc = '';
  @Input() shImgPrefix = true;
  defaultClassName = 'sh-img';

  private prefix = environment.assetPrefix;

  constructor(private el: ElementRef<HTMLImageElement>) {
    this.el.nativeElement.setAttribute(
      'class',
      `${this.defaultClassName} ${this.el.nativeElement.className}`,
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shImgSrc'] || changes['shImgPrefix']) {
      if (this.shImgPrefix) {
        const isFullUrl =
          /^(https?:)?\/\//.test(this.shImgSrc) ||
          this.shImgSrc.startsWith('data:');

        if (isFullUrl) {
          this.el.nativeElement.src = this.shImgSrc;
        } else {
          this.el.nativeElement.src = this.shImgSrc
            ? this.prefix + this.shImgSrc
            : '';
        }
      } else {
        this.el.nativeElement.src = this.shImgSrc;
      }
    }
  }
}
