import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '~/app/shared/shared.module';
import { SOCIALS } from '~/constant/social';
import { Team } from '~/types/teams';

@Component({
  selector: 'app-team-filter',
  imports: [
    SharedModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './team-filter.component.html',
  styleUrl: './team-filter.component.scss',
})
export class TeamFilterComponent implements OnInit, OnChanges {
  @Input() form: FormGroup | undefined;
  readonly socialData = SOCIALS;
  teamData = signal<Team[]>([]);

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.http.get<Team[]>('/data/teams.json').subscribe((res) => {
      this.teamData.set(res);
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      if (changes['form'].currentValue) {
        this.form = changes['form'].currentValue;
      } else {
        this.initForm();
      }
    }
  }

  private initForm() {
    this.form = this.fb.group({
      teamId: [''],
      sortBy: [''],
    });
  }

  public getSocialData(social: string) {
    return this.socialData.find((item) => item._id === social);
  }
}
