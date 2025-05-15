import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team, TEAM_ROLES, TeamMember, TeamRole } from '~/types/teams';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormArray,
} from '@angular/forms';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { TeamService } from '~/app/core/services/team.service';
import { TeamMemberService } from '~/app/core/services/team-member.service';
import { SOCIALS } from '~/constant/social';
import { FormService } from '~/app/shared/services/form.service';

type TeamFormData = {
  title?: string;
  defaultValues?: TeamMember;
};

@Component({
  selector: 'app-team-member-form',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, UiModule],
  templateUrl: './team-member-form.component.html',
  styleUrl: './team-member-form.component.scss',
})
export class TeamMemberFormComponent implements OnInit {
  form: FormGroup;
  teamData = signal<Team[]>([]);
  isEdit: boolean = false;
  readonly teamRoleData: TeamRole[] = TEAM_ROLES;
  readonly socialData = SOCIALS;

  ALL_ROLES: TeamRole[] = [
    'Frontend',
    'Backend',
    'Fullstack',
    'Designer',
    'DevOps',
    'QA',
    'PO',
    'PM',
    'BA',
    'Intern',
    'Unity',
  ];

  constructor(
    private fb: FormBuilder,
    private teamSrv: TeamService,
    private teamMemberSrv: TeamMemberService,
    private formSrv: FormService,
    private dialogRef: MatDialogRef<TeamMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamFormData
  ) {
    this.form = this.fb.group({
      name: [data.defaultValues?.name ?? '', Validators.required],
      nickname: [data.defaultValues?.nickname ?? '', Validators.required],
      birthday: [data.defaultValues?.birthday ?? '', Validators.required],
      avatar: [data.defaultValues?.avatar ?? ''],
      email: [
        data.defaultValues?.email ?? '',
        [Validators.required, Validators.email],
      ],
      roles: [data.defaultValues?.roles ?? []],
      hobbies: this.fb.array([]),
      socials: this.fb.array([]),
      roleInput: [''],
      teamId: ['', Validators.required],
    });
    const defaultValues = this.data?.defaultValues;
    if (defaultValues) {
      this.setFormArray('hobbies', defaultValues.hobbies);
      defaultValues.socials.forEach((socialDt) => {
        this.socials.push(
          this.fb.group({
            platform: [socialDt.platform, Validators.required],
            url: [socialDt.url, Validators.required],
          })
        );
      });
    }

    this.isEdit = !!data.defaultValues;
  }

  ngOnInit(): void {
    this.form.controls['roles'].valueChanges.subscribe((value) => {
      this.form.controls['roleInput'].setValue('');
      this.form.controls['roleInput'].markAsPristine();
    });

    this.teamSrv.find({ pageSize: 100, page: 1 }).subscribe((res) => {
      this.teamData.set(res.items);
    });
  }

  get roles(): FormControl {
    return this.form.get('roles') as FormControl;
  }

  get hobbies() {
    return this.form.get('hobbies') as FormArray;
  }

  get socials() {
    return this.form.get('socials') as FormArray;
  }

  addSocial() {
    this.socials.push(
      this.fb.group({
        platform: ['', Validators.required],
        url: ['', Validators.required],
      })
    );
  }

  private setFormArray(field: keyof TeamMember, values?: string[]) {
    const array = this.form.get(field) as FormArray;
    array.clear();
    values?.forEach((value) => array.push(this.fb.control(value)));
  }

  addToArray(control: FormArray, value: string) {
    control.push(this.fb.control(value, [Validators.required]));
  }

  removeFromArray(control: FormArray, index: number) {
    control.removeAt(index);
  }

  filteredRoles(): TeamRole[] {
    const input = this.form.controls['roleInput'].value?.toLowerCase() ?? '';
    return this.ALL_ROLES.filter(
      (role) =>
        !this.roles.value.includes(role) && role.toLowerCase().includes(input)
    );
  }

  selectRole(role: TeamRole) {
    const current = [...this.roles.value, role];
    this.roles.setValue(current);
    this.form.controls['roleInput'].setValue('');
  }

  removeRole(index: number) {
    const updated = this.roles.value.filter((_: any, i: number) => i !== index);
    this.roles.setValue(updated);
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.form.valid);
    if (this.form.valid) {
      const values = this.form.value;
      delete values['roleInput'];
      if (this.isEdit && this.data?.defaultValues?._id) {
        this.teamMemberSrv
          .update(this.data?.defaultValues?._id, values)
          .subscribe(() => {
            this.dialogRef.close({ success: true });
          });
      } else {
        this.teamMemberSrv.create(values).subscribe(() => {
          this.dialogRef.close({ success: true });
        });
      }
    }
  }
}
