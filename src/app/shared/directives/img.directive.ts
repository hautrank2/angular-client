import { Directive, ElementRef, Input } from '@angular/core';
import { environment } from '~/environments/environment';

@Directive({
  selector: '[appImg]',
  standalone: false,
})
export class ImgDirective {
  @Input() appImgSrc = '';

  private prefix = environment.assetPrefix;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnChanges() {
    this.el.nativeElement.src = this.appImgSrc
      ? this.prefix + this.appImgSrc
      : '';
  }
}
