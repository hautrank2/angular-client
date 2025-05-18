import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
  // ===== Inputs =====
  @Input() accept = '*/*';
  @Input() maxFiles = 1;
  @Input() maxSizeMB = 5;
  @Input() imgProps: Record<string, any> = {}; // dùng với [appAttr] nếu cần
  @Input() formArray: FormArray | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  files: File[] = [];
  previews: string[] = [];

  // ===== ControlValueAccessor callbacks =====
  private onChange: (files: File[]) => void = () => {
    this.formArray?.clear();
    this.files.forEach((file) => {
      this.formArray?.push(new FormControl(file));
    });
  };
  private onTouched: () => void = () => {};

  ngOnInit(): void {}

  // Khi formControlName truyền giá trị vào component
  writeValue(files: File[]): void {
    this.files = files || [];
    this.generatePreviews();
  }

  // Đăng ký khi giá trị thay đổi
  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  // Đăng ký khi control bị "touch"
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // (Optional) nếu muốn xử lý trạng thái disabled
  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  // Gọi khi người dùng chọn file
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selected = input.files;

    if (!selected) return;

    const validFiles: File[] = [];

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const sizeMB = file.size / 1024 / 1024;

      if (sizeMB <= this.maxSizeMB) {
        validFiles.push(file);
      }
    }

    this.files =
      this.maxFiles === 1
        ? [validFiles[0]]
        : validFiles.slice(0, this.maxFiles);
    this.onChange(this.files);
    this.onTouched();
    this.generatePreviews();
  }

  // Tạo preview ảnh
  private generatePreviews() {
    this.previews = [];

    this.files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => this.previews.push(reader.result as string);
        reader.readAsDataURL(file);
      }
    });
  }

  // Xoá ảnh
  removeFile(index: number) {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
    this.onChange(this.files);
  }

  // Mở file selector
  triggerInput() {
    this.fileInput.nativeElement.click();
  }
}
