import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job, Skill } from '~/app/types/job';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LOCATION_DEFAULT, SKILL_DATA } from '~/app/constant/job';
import { SharedModule } from '~/app/shared/shared.module';
import { JobService } from '~/app/core/services/job.service';
import { UiModule } from '~/app/shared/ui/ui.module';

type JobFormData = {
  title?: string;
  defaultValues?: Job;
};
@Component({
  selector: 'app-job-form',
  imports: [SharedModule, FormsModule, UiModule, ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.scss',
})
export class JobFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<JobFormComponent>);
  readonly data = inject<JobFormData>(MAT_DIALOG_DATA);
  readonly currentSkill = model('');

  form: FormGroup;
  skillsData = signal<Skill[]>([]);
  isEdit: boolean = false;

  jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract']; // ví dụ nếu JobType là enum

  constructor(private fb: FormBuilder, private jobSrv: JobService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      location: [LOCATION_DEFAULT, Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      skillInput: [''],
      skills: this.fb.array([], Validators.required),
      requirement: this.fb.array([], Validators.required),
      responsibility: this.fb.array([], Validators.required),
      benefit: this.fb.array([], Validators.required),
    });

    const job = this.data?.defaultValues;
    if (job) {
      this.form.patchValue({
        title: job.title,
        location: job.location,
        type: job.type,
        description: job.description,
      });

      this.setFormArray('skills', job.skills);
      this.setFormArray('requirement', job.requirement);
      this.setFormArray('responsibility', job.responsibility);
      this.setFormArray('benefit', job.benefit);
    }

    this.skillsData.set(SKILL_DATA);

    this.isEdit = !!job;
  }

  ngOnInit(): void {
    this.form.get('skillInput')?.valueChanges.subscribe((value) => {
      this.currentSkill.set(value);
    });
  }

  private setFormArray(field: keyof Job, values?: string[]) {
    const array = this.form.get(field) as FormArray;
    array.clear();
    values?.forEach((value) => array.push(this.fb.control(value)));
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
    control.push(this.fb.control(value, [Validators.required]));
  }

  removeFromArray(control: FormArray, index: number) {
    control.removeAt(index);
  }

  submit() {
    const values = this.form.value;
    delete values['skillInput'];
    if (this.isEdit && this.data?.defaultValues?._id) {
      this.jobSrv
        .update(this.data?.defaultValues?._id, values)
        .subscribe(() => {
          this.dialogRef.close({ success: true });
        });
    } else {
      this.jobSrv.create(values).subscribe(() => {
        this.dialogRef.close({ success: true });
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
