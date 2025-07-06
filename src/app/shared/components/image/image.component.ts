import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  signal,
} from '@angular/core';

export type ImageWrapperAction = 'preview' | 'remove';
@Component({
  selector: 'sh-image',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  @Output() preview = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Input() shImageActions: ImageWrapperAction[] = ['preview'];
  hover = signal<boolean>(false);
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const wrapper = this.el.nativeElement.querySelector('.sh-img-wrapper');
    const overlay = this.el.nativeElement.querySelector('.sh-img-overlay');
    this.renderer.listen(wrapper, 'mouseenter', () => {
      this.renderer.setStyle(overlay, 'opacity', '1');
    });
    this.renderer.listen(wrapper, 'mouseleave', () => {
      this.renderer.setStyle(overlay, 'opacity', '0');
    });
  }

  onPreview() {
    this.preview.emit();
  }

  onRemove() {
    this.remove.emit();
  }

  onHover(value: boolean) {
    this.hover.set(value);
  }
}
