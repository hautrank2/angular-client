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
import { UiModule } from '~/app/shared/ui.module';
import { TeamService } from '~/app/core/services/team.service';

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

  form: FormGroup;
  membersFormValue = signal<string[]>([]);

  // 👇 Giả lập danh sách member từ backend
  membersData = signal<ApiPaginationResponse<TeamMember>>(API_REPONSE_BASE);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private teamSrv: TeamService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      memberInput: [''],
      members: this.fb.array([]), // chỉ lưu _id
    });

    const team = this.data?.defaultValues;
    if (team) {
      this.form.patchValue({
        name: team.name,
        description: team.description,
      });

      this.setFormArray('members', team.members?.map((e) => e._id) || []);
    }
    this.isEdit = !!team;
  }

  private setFormArray(field: keyof Team, values?: string[]) {
    const array = this.form.get(field) as FormArray;
    array.clear();
    values?.forEach((value) => array.push(this.fb.control(value)));
  }

  ngOnInit(): void {
    this.http.get<TeamMember[]>('/data/members.json').subscribe((res) => {
      this.membersData.set({
        totalCount: res.length,
        totalPage: res.length / 10,
        pageSize: 10,
        page: 1,
        items: res,
      });
    });

    this.form.get('memberInput')?.valueChanges.subscribe((value) => {
      this.currentMember.set(value);
    });
    this.form.get('members')?.valueChanges.subscribe((value) => {
      this.membersFormValue.set(value);
    });
  }

  //#region Member hanlder
  get members() {
    return this.form.get('members') as FormArray;
  }

  removeMember(index: number) {
    this.members.removeAt(index);
  }

  readonly filteredMember = computed(() => {
    const excludeSelectedMembers = this.membersData().items.filter(
      (member) =>
        !this.membersFormValue().find(
          (selectedMember: string) => member._id === selectedMember
        )
    );

    if (!this.currentMember()) {
      return excludeSelectedMembers;
    }
    return excludeSelectedMembers.filter((member) =>
      member.name.toLowerCase().startsWith(this.currentMember().toLowerCase())
    );
  });

  selectMember(event: MatAutocompleteSelectedEvent) {
    this.members.push(this.fb.control(event.option.value));
    this.form.patchValue({ memberInput: '' });
  }

  getMemberTitleByKey(key: string) {
    return this.membersData().items.find((e) => e._id === key)?.name;
  }

  //#endregion

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
}
