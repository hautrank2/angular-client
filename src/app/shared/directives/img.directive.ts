import { Directive, ElementRef, Input } from '@angular/core';
import { environment } from '~/environments/environment';

@Directive({
  selector: '[shImg]',
  standalone: false,
})
export class ImgDirective {
  @Input() shImgSrc = '';

  private prefix = environment.assetPrefix;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnChanges() {
    this.el.nativeElement.src = this.shImgSrc
      ? this.prefix + this.shImgSrc
      : '';
  }
}
