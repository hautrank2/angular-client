import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ShUploadFormField } from '../form/form.types';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sh-upload',
  standalone: false,
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input({ required: true }) field!: ShUploadFormField;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private sub = new Subscription();
  fileUrls = signal<string[]>([]);

  constructor(private formSrv: FormService) {
    console.log(this.field, this.control);
  }

  ngOnInit(): void {
    if (this.control) {
      this.sub.add(
        this.control.valueChanges.subscribe((res) => {
          this.updateFileUrls();
        }),
      );
    }
    this.updateFileUrls();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.updateFileUrls();
  }

  get defaultValues() {
    return this.multiple ? [] : null;
  }

  get accept(): string {
    return this.field?.accept?.join(',') || '*';
  }

  get multiple(): boolean {
    return !!this.field?.multiple;
  }

  get maxFileSize(): number | undefined {
    return this.field?.maxFileSize;
  }

  get control(): FormControl {
    return (
      (this.formGroup?.get(this.field.key) as FormControl) ||
      new FormControl(this.defaultValues, [
        this.multiple ? this.formSrv.filesValidate : this.formSrv.fileValidator,
      ])
    );
  }

  get files(): File[] {
    if (!this.control.value) return [];
    return this.multiple
      ? (this.control.value as File[])
      : [this.control.value as File];
  }

  private updateFileUrls() {
    const files = this.files;
    this.fileUrls().forEach((url) => URL.revokeObjectURL(url));
    this.fileUrls.set(files.map((file) => URL.createObjectURL(file)));
  }

  onUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const fileList = input?.files;
    if (!fileList) {
      console.error('Upload failed: files not found');
      return;
    }
    const files: File[] = Array.from(fileList);
    if (this.multiple) {
      this.control.setValue(files);
    } else {
      this.control.setValue(files[0]);
    }
  }
}
