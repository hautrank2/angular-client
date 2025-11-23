import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormService } from '~/app/shared/services/form.service';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { finalize, Observable, catchError, EMPTY } from 'rxjs';
import { KEY_NAME } from '../../constants/common';
import { EntityForm } from '../entity-manager/entity-manager.types';
import { ToastrService } from 'ngx-toastr';

export interface EntityFormData<T extends { [key: string]: any }> {
  title?: string;
  defaultValues?: T;

  keyName?: string;
  formFields: ShFormField[];
  putEntity: (id: any, entity: T | FormData, defaultValues: T) => Observable<T>;
  postEntity: (entity: T | FormData) => Observable<T>;

  formConfig: EntityForm;
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

  loading = signal<boolean>(false);
  form: FormGroup = new FormGroup({});
  membersFormValue = signal<string[]>([]);

  // 👇 Giả lập danh sách member từ backend
  isJsonForm: boolean = false;

  constructor(
    private formSrv: FormService,
    private toastSrv: ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this.formSrv.buildForm(
      this.data.formFields,
      this.data.defaultValues,
    );
  }

  get isEdit() {
    return !!this.data.defaultValues;
  }

  get keyName(): string {
    return this.data.keyName || KEY_NAME;
  }

  submit() {
    if (this.form.valid) {
      const formValues = this.form.value;
      const values =
        this.data.formConfig.reqBody === 'json'
          ? formValues
          : this.formSrv.buildFormData(formValues);

      this.loading.set(true);

      const request$ =
        this.isEdit && this.data.defaultValues
          ? this.data.putEntity(
              this.data.defaultValues[this.keyName],
              values,
              this.data.defaultValues,
            )
          : this.data.postEntity(values);

      request$
        .pipe(
          catchError((e: any) => {
            const msg = this.extractErrorMessage(e);
            this.toastSrv.error(msg);
            return EMPTY;
          }),
          finalize(() => this.loading.set(false)),
        )
        .subscribe(() => {
          this.dialogRef.close({ success: true });
        });
    }
  }

  private extractErrorMessage(err: any): string {
    if (!err) return 'Unknown error';

    // Khi Angular HTTP client trả HttpErrorResponse
    if (err.error) {
      const inner = err.error;

      // case string: error: "Something wrong"
      if (typeof inner === 'string') return inner;

      // case backend trả object { message: "...", error: "...", msg: "...", detail: "..."}
      if (inner.message) return inner.message;
      if (inner.error) return inner.error;
      if (inner.msg) return inner.msg;
      if (inner.detail) return inner.detail;

      // fallback: stringify
      return JSON.stringify(inner);
    }

    // Trường hợp err là string
    if (typeof err === 'string') return err;

    // Trường hợp err.message ở root
    if (err.message) return err.message;

    // fallback cuối cùng
    try {
      return JSON.stringify(err);
    } catch {
      return 'Unexpected error occurred';
    }
  }

  close() {
    this.dialogRef.close();
  }
}
