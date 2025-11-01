import {
  AfterViewInit,
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
import {
  ImageWrapperAction,
  ImageWrapperState,
} from '../image/image.component';
import {
  FullscreenOverlayContainer,
  Overlay,
  OverlayContainer,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'sh-avatar-group',
  standalone: false,
  templateUrl: './avatar-group.component.html',
  styleUrl: './avatar-group.component.scss',
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AvatarGroupComponent {
  @Input({ required: true }) srcs: string[] = [];
  @Input() prefix: boolean = false;
  @Input() maxCount: number = 5;

  @Input() imgClass = '';
  @Input() imgStyle = {};
  @Input() width: number | string = 40;
  @Input() height: number | string = 40;
  @Input() shImageActions: ImageWrapperAction[] = ['preview'];
  @Output() preview = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  @ViewChild('previewTpl') previewTpl!: TemplateRef<any>;
  private overlayRef?: OverlayRef;
  rotation = 0;
  flipX = false;
  flipY = false;
  scale = 1;

  hover = signal<null | number>(null);
  state = signal<ImageWrapperState>('default');

  previewImg = signal<number | null>(null);

  constructor(
    private overlay: Overlay,
    private vcr: ViewContainerRef,
  ) {}

  initPreviewStyle() {
    this.rotation = 0;
    this.flipX = false;
    this.flipY = false;
    this.scale = 1;
  }

  get currPreview(): string | null {
    const currIndex = this.previewImg();
    return currIndex !== null && currIndex !== undefined
      ? this.srcs[currIndex]
      : null;
  }

  get imgHoverd() {
    return this.hover() !== null;
  }

  get style() {
    return {
      width: this.width,
      height: this.height,
      ...this.imgStyle,
    };
  }

  get displayImgs(): string[] {
    return this.srcs.slice(0, this.maxCount);
  }

  get hiddenImgs(): string[] {
    return this.srcs.slice(this.maxCount - 1, -1);
  }

  isPreview() {
    return;
  }

  onRemove() {
    this.remove.emit();
  }

  onPreview(index: number) {
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

    this.previewImg.set(index);
  }

  closePreview() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
      this.previewImg.set(null);
      this.initPreviewStyle();
    }
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

  onPrevPreview() {
    const currPreviewImg = this.previewImg();
    this.previewImg.set(
      currPreviewImg ? currPreviewImg - 1 : this.srcs.length - 1,
    );
  }

  onNextPreview() {
    const currPreviewImg = this.previewImg();
    this.previewImg.set(
      currPreviewImg === this.srcs.length - 1 ? 0 : (currPreviewImg ?? 0) + 1,
    );
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
