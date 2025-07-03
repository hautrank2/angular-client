import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormService } from '~/app/shared/services/form.service';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Observable } from 'rxjs';
import { KEY_NAME } from '../../constants/common';

export interface EntityFormData<T extends { [key: string]: any }> {
  title?: string;
  defaultValues?: T;

  keyName?: string;
  formFields: ShFormField[];
  putEntity: (id: any, entity: T) => Observable<T>;
  postEntity: (entity: T) => Observable<T>;
}

@Component({
  selector: 'app-entity-form',
  standalone: false,
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss',
})
export class EntityFormComponent<T extends { [key: string]: any }>
  implements OnInit
{
  readonly dialogRef = inject(MatDialogRef<EntityFormComponent<T>>);
  readonly data = inject<EntityFormData<T>>(MAT_DIALOG_DATA);
  readonly currentMember = model('');
  isEdit: boolean = false;

  form: FormGroup = new FormGroup({});
  membersFormValue = signal<string[]>([]);

  // 👇 Giả lập danh sách member từ backend
  isJsonForm: boolean = false;

  constructor(private formSrv: FormService) {}

  ngOnInit(): void {
    this.form = this.formSrv.buildForm(this.data.formFields);
    if (this.data.defaultValues) {
      this.formSrv.patchForm(
        this.form,
        this.data.defaultValues,
        this.data.formFields,
      );
    }
  }

  get keyName(): string {
    return this.data.keyName || KEY_NAME;
  }

  submit() {
    if (this.form.valid) {
      const values = this.form.value;
      delete values['memberInput'];
      if (this.isEdit && this.data.defaultValues) {
        this.data
          .putEntity(this.data.defaultValues[this.keyName], values)
          .subscribe(() => {
            this.dialogRef.close({ success: true });
          });
      } else {
        this.data.postEntity(values).subscribe(() => {
          this.dialogRef.close({ success: true });
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
