import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Team } from '~/types/teams';
import { SharedModule } from '~/app/shared/shared.module';
import { SOCIALS } from '~/constant/social';
import { FormField } from '~/app/shared/components/form/form.types';
import { UiModule } from '~/app/shared/ui/ui.module';
import { ReactiveFormsModule, Validators } from '@angular/forms';

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
      validators: [Validators.required, Validators.minLength(4)],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      value: '',
      validators: [Validators.required, Validators.email],
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      value: '',
      validators: [Validators.required, Validators.minLength(6)],
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
      value: null,
      validators: [Validators.required, Validators.min(0), Validators.max(120)],
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      value: '',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
      validators: [Validators.required],
    },
    {
      key: 'dob',
      label: 'Date of Birth',
      type: 'date',
      value: '',
      validators: [Validators.required],
    },
    {
      key: 'subscription',
      label: 'Subscription Type',
      type: 'radio',
      value: 'basic',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      key: 'acceptTerms',
      label: 'I accept the Terms and Conditions',
      type: 'checkbox',
      value: false,
      validators: [Validators.requiredTrue],
    },
    {
      key: 'address',
      label: 'Address',
      type: 'group',
      fields: [
        {
          key: 'street',
          label: 'Street Address',
          type: 'text',
          validators: [Validators.required],
        },
        {
          key: 'city',
          label: 'City',
          type: 'text',
          validators: [Validators.required],
        },
        {
          key: 'zip',
          label: 'ZIP Code',
          type: 'number',
          validators: [Validators.required],
        },
        {
          key: 'country',
          label: 'Country',
          type: 'text',
          validators: [Validators.required],
        },
      ],
    },
    {
      key: 'contacts',
      label: 'Emergency Contacts',
      type: 'array',
      formArrayOptions: {
        itemLabel: 'Contact',
        cols: 3,
        col: 1,
        row: 1,
        rowHeight: 320,
      },
      arrayFields: [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          validators: [Validators.required],
        },
        {
          key: 'relation',
          type: 'text',
          label: 'Relation',
          validators: [Validators.required],
        },
        {
          key: 'phone',
          type: 'text',
          label: 'Phone Number',
          validators: [Validators.required],
        },
      ],
    },
    {
      key: 'profession',
      label: 'Profession',
      type: 'autocomplete',
      placeholder: 'Select or type your profession',
      value: '',
      options: [
        { label: 'Engineer', value: 'engineer' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Artist', value: 'artist' },
        { label: 'Developer', value: 'developer' },
      ],
      autocompleteOptions: {
        debounceTime: 0,
      },
      validators: [Validators.required],
    },
  ];
}
