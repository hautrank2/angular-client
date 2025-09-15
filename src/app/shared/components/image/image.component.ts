import {
  FullscreenOverlayContainer,
  Overlay,
  OverlayContainer,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

export type ImageWrapperAction = 'preview' | 'remove';
export type ImageWrapperState = 'preview' | 'default';
@Component({
  selector: 'sh-image',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ImageComponent {
  @Input({ required: true }) src!: string;
  @Input() alt = '';
  @Input() prefix = true;
  @Input() imgClass = '';
  @Input() imgStyle = {};
  @Input() width!: number | string;
  @Input() height!: number | string;

  @Output() preview = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Input() shImageActions: ImageWrapperAction[] = ['preview'];

  @ViewChild('previewTpl') previewTpl!: TemplateRef<any>;
  private overlayRef?: OverlayRef;
  rotation = 0;
  flipX = false;
  flipY = false;
  scale = 1;

  hover = signal<boolean>(false);
  state = signal<ImageWrapperState>('default');
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private vcr: ViewContainerRef,
  ) {}

  ngAfterViewInit(): void {
    const wrapper = this.el.nativeElement.querySelector('.sh-image-wrapper');

    if (wrapper) {
      this.renderer.listen(wrapper, 'mouseenter', () => {
        this.hover.set(true);
      });
      this.renderer.listen(wrapper, 'mouseleave', () => {
        this.hover.set(false);
      });
    } else {
      console.warn('sh-img-wrapper not found');
    }
  }

  isPreview() {
    return;
  }

  onPreview() {
    this.preview.emit();
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      panelClass: 'img-preview-panel',
    });

    const portal = new TemplatePortal(this.previewTpl, this.vcr);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => this.closePreview());
  }

  closePreview() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
      // this.rotation = 0;
    }
  }

  onRemove() {
    this.remove.emit();
  }

  onHover(value: boolean) {
    this.hover.set(value);
  }

  //#region Preview
  get transformStyle(): string {
    const scaleX = (this.flipX ? -1 : 1) * this.scale;
    const scaleY = (this.flipY ? -1 : 1) * this.scale;
    return `rotate(${this.rotation}deg) scale(${scaleX}, ${scaleY})`;
  }

  onFlip(vertial: boolean) {
    if (vertial) {
      this.flipY = !this.flipY;
    } else {
      this.flipX = !this.flipX;
    }
  }

  onRotate(ins: boolean) {
    this.rotation = this.rotation + (ins ? 90 : -90);
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = -event.deltaY; // scroll lên: dương, xuống: âm
    const step = 0.1;

    // Update scale
    this.scale += delta > 0 ? step : -step;
    this.scale = Math.min(Math.max(this.scale, 0.2), 5); // giới hạn 0.2x - 5x
  }

  imgPreviewActions = [
    {
      icon: 'rotate_left',
      label: 'Rotate Left',
      action: () => this.onRotate(false),
    },
    {
      icon: 'rotate_right',
      label: 'Rotate Right',
      action: () => this.onRotate(true),
    },
    {
      icon: 'swap_horizontal_circle',
      label: 'Flip Horizontal',
      action: () => this.onFlip(false),
      iconSet: 'material-icons-outlined',
    },
    {
      icon: 'swap_vertical_circle',
      label: 'Flip Vertical',
      action: () => this.onFlip(true),
      iconSet: 'material-icons-outlined',
    },
  ];
  //#endregion
}
