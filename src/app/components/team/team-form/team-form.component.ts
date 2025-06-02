import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Team, TeamMember } from '~/types/teams';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedModule } from '~/app/shared/shared.module';
import { API_REPONSE_BASE, ApiPaginationResponse } from '~/types/query';
import { UiModule } from '~/app/shared/ui/ui.module';
import { TeamService } from '~/app/core/services/team.service';
import { TeamMemberService } from '~/app/core/services/team-member.service';
import { FormService } from '~/app/shared/services/form.service';
import { FormField } from '~/app/shared/components/form/form.types';

type TeamFormData = {
  title?: string;
  defaultValues?: Team;
};
@Component({
  selector: 'app-team-form',
  imports: [
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    UiModule,
    ReactiveFormsModule,
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss',
})
export class TeamFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TeamFormComponent>);
  readonly data = inject<TeamFormData>(MAT_DIALOG_DATA);
  readonly currentMember = model('');
  isEdit: boolean = false;

  form: FormGroup = new FormGroup({});
  formFields: FormField[] = [];
  membersFormValue = signal<string[]>([]);

  // 👇 Giả lập danh sách member từ backend
  membersData = signal<ApiPaginationResponse<TeamMember>>(API_REPONSE_BASE);
  isJsonForm: boolean = false;

  constructor(private teamSrv: TeamService, private formSrv: FormService) {
    this.isEdit = !!this.data.defaultValues;
    this.teamSrv.getFormFields().subscribe((res) => {
      this.formFields = res;
      this.form = this.formSrv.buildForm(res);
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      const values = this.form.value;
      delete values['memberInput'];
      if (this.isEdit && this.data?.defaultValues?._id) {
        this.teamSrv
          .update(this.data?.defaultValues?._id, values)
          .subscribe(() => {
            this.dialogRef.close({ success: true });
          });
      } else {
        this.teamSrv.create(values).subscribe(() => {
          this.dialogRef.close({ success: true });
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get jsonValue(): string {
    return JSON.stringify(this.form.getRawValue(), null, 2);
  }

  onJsonValueChange(value: string): void {
    this.form.patchValue(JSON.parse(value));
  }
}
