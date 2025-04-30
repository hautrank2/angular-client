import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
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
import { Job, Skill } from '~/types/job';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { LOCATION_DEFAULT, SKILL_DATA } from '~/constant/job';
import { CoreModule } from '~/app/core/core.module';

type JobFormData = {
  title?: string;
  defaultValues?: Job;
};
@Component({
  selector: 'app-job-form',
  imports: [
    CoreModule,
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
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.scss',
})
export class JobFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<JobFormComponent>);
  readonly data = inject<JobFormData>(MAT_DIALOG_DATA);
  readonly currentSkill = model('');

  form: FormGroup;
  skillsData = signal<Skill[]>([]);

  jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract']; // ví dụ nếu JobType là enum

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      location: [LOCATION_DEFAULT, Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      skillInput: ['', Validators.required],
      skills: this.fb.array([], Validators.required),
      requirement: this.fb.array([]),
      responsibility: this.fb.array([]),
      benefit: this.fb.array([]),
    });

    this.skillsData.set(SKILL_DATA);
  }

  ngOnInit(): void {
    this.form.get('skillInput')?.valueChanges.subscribe((value) => {
      this.currentSkill.set(value);
    });
  }

  //#region Skill hanlder
  get skills() {
    return this.form.get('skills') as FormArray;
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  readonly filteredSkill = computed(() => {
    const excludeSelectedSkills = this.skillsData().filter(
      (skill) =>
        !this.skills.value.find(
          (selectedSkill: string) => skill.key === selectedSkill
        )
    );
    if (!this.currentSkill()) {
      return excludeSelectedSkills;
    }
    return excludeSelectedSkills.filter((skill) =>
      skill.title.toLowerCase().startsWith(this.currentSkill().toLowerCase())
    );
  });

  selectSkill(event: MatAutocompleteSelectedEvent) {
    this.skills.push(this.fb.control(event.option.value));
    this.form.patchValue({ skillInput: '' });
  }

  getSkillTitleByKey(key: string) {
    return this.skillsData().find((e) => e.key === key)?.title;
  }

  //#endregion

  get requirement() {
    return this.form.get('requirement') as FormArray;
  }

  get responsibility() {
    return this.form.get('responsibility') as FormArray;
  }

  get benefit() {
    return this.form.get('benefit') as FormArray;
  }

  addToArray(control: FormArray, value: string) {
    control.push(this.fb.control(value));
  }

  removeFromArray(control: FormArray, index: number) {
    control.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      const job: Job = {
        id: '', // nếu edit thì giữ id cũ
        createdAt: '', // backend tự sinh hoặc giữ
        updatedAt: '', // backend tự sinh
        ...this.form.value,
      };
      console.log('Submit job:', job);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
