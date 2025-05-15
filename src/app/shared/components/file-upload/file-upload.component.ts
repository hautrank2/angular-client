import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
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
  @Input() accept = '*/*';
  @Input() maxFiles = 1;
  @Input() maxSizeMB = 5;

  files: File[] = [];
  previews: string[] = [];

  onChange = (files: File[] | null) => {};
  onTouched = () => {};

  ngOnInit(): void {}

  writeValue(files: File[] | null): void {
    this.files = files ?? [];
    this.generatePreviews();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;

    if (!selectedFiles) return;

    const validFiles: File[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const sizeMB = file.size / (1024 * 1024);

      if (sizeMB <= this.maxSizeMB) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > this.maxFiles) {
      validFiles.length = this.maxFiles;
    }

    this.files = validFiles;
    this.generatePreviews();
    this.onChange(this.files);
    this.onTouched();
  }

  generatePreviews() {
    this.previews = [];
    this.files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => this.previews.push(reader.result as string);
        reader.readAsDataURL(file);
      }
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
    this.onChange(this.files);
  }
}
