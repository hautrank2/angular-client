import { Component, signal } from '@angular/core';
import { Team } from '~/app/types/teams';
import { SharedModule } from '~/app/shared/shared.module';
import { SOCIALS } from '~/app/constant/social';
import { UiModule } from '~/app/shared/ui/ui.module';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '~/app/core/services/team.service';
import { TeamMemberService } from '~/app/core/services/team-member.service';
import { finalize } from 'rxjs';
import { ShFormField } from '~/app/shared/components/form/form.types';

@Component({
  selector: 'app-teams',
  imports: [SharedModule, UiModule, ReactiveFormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {
  readonly socialData = SOCIALS;
  teamData = signal<Team[]>([]);

  constructor(
    private teamSrv: TeamService,
    private teamMemberSrv: TeamMemberService,
  ) {
    this.fetchTeamData();
  }

  public getSocialData(social: string) {
    return this.socialData.find((item) => item._id === social);
  }

  private fetchTeamData() {
    this.teamSrv
      .find({ pageSize: 100, page: 1 })
      .pipe(
        finalize(() => {
          this.fetchTeamMember();
        }),
      )
      .subscribe((res) => {
        this.teamData.set(res.items);
      });
  }

  private fetchTeamMember() {
    const data = this.teamData();
    this.teamData().forEach((team, index) => {
      this.teamMemberSrv
        .find({ pageSize: 100, page: 1, teamId: team._id })
        .subscribe((res) => {
          data[index].members = res.items;
        });
    });
    this.teamData.set(data);
  }

  onJumpToTeam(team: Team) {
    const el = document.getElementById(team.name);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formFieldConfig: ShFormField[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      defaultValue: '',
      validators: [Validators.required, Validators.minLength(4)],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      defaultValue: '',
      validators: [Validators.required, Validators.email],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      defaultValue: '',
      validators: [Validators.required, Validators.minLength(6)],
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      defaultValue: null,
      validators: [Validators.required, Validators.min(0), Validators.max(120)],
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: '',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
      validators: [Validators.required],
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      defaultValue: '',
      validators: [Validators.required],
    },
    {
      name: 'subscription',
      label: 'Subscription Type',
      type: 'radio',
      defaultValue: 'basic',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      name: 'acceptTerms',
      label: 'I accept the Terms and Conditions',
      type: 'checkbox',
      defaultValue: false,
      validators: [Validators.requiredTrue],
    },
    {
      name: 'address',
      label: 'Address',
      type: 'group',
      fields: [
        {
          name: 'street',
          label: 'Street Address',
          type: 'text',
          validators: [Validators.required],
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          validators: [Validators.required],
        },
        {
          name: 'zip',
          label: 'ZIP Code',
          type: 'number',
          validators: [Validators.required],
        },
        {
          name: 'country',
          label: 'Country',
          type: 'text',
          validators: [Validators.required],
        },
      ],
    },
    {
      name: 'contacts',
      label: 'Emergency Contacts',
      type: 'groupArray',
      config: {
        itemLabel: 'Contact',
        cols: 3,
        col: 1,
        row: 1,
        rowHeight: 320,
      },
      arrayFields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          validators: [Validators.required],
        },
        {
          name: 'relation',
          type: 'text',
          label: 'Relation',
          validators: [Validators.required],
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          validators: [Validators.required],
        },
      ],
    },
    {
      name: 'profession',
      label: 'Profession',
      type: 'autocomplete',
      placeholder: 'Select or type your profession',
      defaultValue: '',
      options: [
        { label: 'Engineer', value: 'engineer' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Artist', value: 'artist' },
        { label: 'Developer', value: 'developer' },
      ],
      debounceTime: 0,
      validators: [Validators.required],
    },
  ];
}
