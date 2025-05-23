import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

export type DynamicAttrType = Record<string, any>;
@Directive({
  selector: '[appAttr]',
  standalone: false,
})
export class AttrDirective implements OnChanges {
  @Input() appAttr: Record<string, any> = {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appAttr']) {
      const attrs = this.appAttr || {};
      for (const key of Object.keys(attrs)) {
        if (attrs[key] !== undefined && attrs[key] !== null) {
          this.renderer.setAttribute(this.el.nativeElement, key, attrs[key]);
        } else {
          this.renderer.removeAttribute(this.el.nativeElement, key);
        }
      }
    }
  }
}
