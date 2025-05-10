import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Team, TeamMember, TeamRole } from '~/types/teams';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '~/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';

type TeamFormData = {
  title?: string;
  defaultValues?: TeamMember;
};

@Component({
  selector: 'app-team-member-form',
  imports: [
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './team-member-form.component.html',
  styleUrl: './team-member-form.component.scss',
})
export class TeamMemberFormComponent implements OnInit {
  form: FormGroup;
  teamData = signal<Team[]>([]);

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
    private http: HttpClient,
    private dialogRef: MatDialogRef<TeamMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamFormData
  ) {
    this.form = this.fb.group({
      name: [data.defaultValues?.name ?? '', Validators.required],
      nickname: [data.defaultValues?.nickname ?? '', Validators.required],
      email: [
        data.defaultValues?.email ?? '',
        [Validators.required, Validators.email],
      ],
      roles: [data.defaultValues?.roles ?? []],
      roleInput: [''],
      teamId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.controls['roles'].valueChanges.subscribe((value) => {
      this.form.controls['roleInput'].setValue('');
      this.form.controls['roleInput'].markAsPristine();
    });

    this.http.get<Team[]>('/data/teams.json').subscribe((res) => {
      this.teamData.set(res);
    });
  }

  get roles(): FormControl {
    return this.form.get('roles') as FormControl;
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
    if (this.form.valid) {
      const result: Partial<TeamMember> = {
        ...this.form.value,
        roles: this.roles.value,
      };
      this.dialogRef.close(result);
    }
  }
}
