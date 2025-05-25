import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Team } from '~/types/teams';
import { SharedModule } from '~/app/shared/shared.module';
import { SOCIALS } from '~/constant/social';
import { FormField } from '~/app/shared/components/form/form.types';
import { UiModule } from '~/app/shared/ui/ui.module';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-teams',
  imports: [SharedModule, UiModule, ReactiveFormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {
  readonly socialData = SOCIALS;
  teamData = signal<Team[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<Team[]>('/data/teams.json').subscribe((res) => {
      this.teamData.set(res);
    });
  }

  public getSocialData(social: string) {
    return this.socialData.find((item) => item._id === social);
  }

  onJumpToTeam(team: Team) {
    const el = document.getElementById(team.name);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formFieldConfig: FormField[] = [
    {
      key: 'username',
      label: 'Username',
      type: 'text',
      value: '',
      validators: [Validators.required],
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
      value: 25,
      validators: [Validators.required, Validators.min(0)],
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      value: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      key: 'genderAuto',
      label: 'Gender',
      type: 'autocomplete',
      placeholder: 'Choose gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      autocompleteOptions: {
        debounceTime: 0,
      },
    },
    {
      key: 'subscription',
      label: 'Subscription Type',
      type: 'radio',
      value: 'basic',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
      ],
    },
    {
      key: 'dob',
      label: 'Date of Birth',
      type: 'date',
      value: '1990-01-01',
    },

    {
      key: 'acceptTerms',
      label: 'Accept Terms',
      type: 'checkbox',
      value: false,
      validators: [Validators.required],
    },
    {
      key: 'address',
      label: 'Address',
      type: 'group',
      fields: [
        {
          key: 'street',
          label: 'Street',
          type: 'text',
        },
        {
          key: 'city',
          label: 'City',
          type: 'text',
        },
        {
          key: 'zip',
          label: 'ZIP Code',
          type: 'number',
        },
      ],
    },
    {
      key: 'contacts',
      label: 'Contact Numbers',
      type: 'array',
      formArrayOptions: {
        cols: 3,
        col: 1,
        row: 1,
        rowHeight: 142,
      },
      arrayFields: [
        {
          key: 'phone',
          type: 'text',
          label: 'Phone',
        },
      ],
    },
  ];
}
