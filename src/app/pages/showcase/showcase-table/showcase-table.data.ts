import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ShColumn } from '~/app/shared/components/table/table.types';

export const jsonValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let isJson = false;
    try {
      JSON.parse(control.value);
      isJson = true;
    } catch {}
    return !isJson ? { isJson: true } : null;
  };
};

const status = [
  {
    value: 'active',
    iconName: 'check_circle',
    label: 'Active',
    color: 'green',
  },
  { value: 'inactive', iconName: 'cancel', label: 'Inactive', color: 'red' },
  { value: 'unknown', iconName: 'help', label: 'Unknown', color: 'gray' },
];

const genders = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
];

export const TABLE_COLUMNS: ShColumn<any>[] = [
  { name: 'id', label: 'ID', type: 'text', sticky: true, disabled: true },
  { name: 'name', label: 'Name', type: 'text', sticky: true },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    formField: {
      name: 'age',
      type: 'number',
    },
  },
  {
    name: 'createdAt',
    label: 'Created Date',
    type: 'date',
    formField: {
      name: 'createdAt',
      type: 'date',
    },
  },
  {
    name: 'status',
    label: 'Status',
    type: 'status',
    getConfig: (value) => {
      switch (value) {
        case 'active':
          return { iconName: 'check_circle', label: 'Active', color: 'green' };
        case 'inactive':
          return { iconName: 'cancel', label: 'Inactive', color: 'red' };
        default:
          return { iconName: 'help', label: 'Unknown', color: 'gray' };
      }
    },
    formField: {
      name: 'status',
      type: 'select',
      options: status.map((e) => ({ value: e.value, label: e.label })),
    },
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Moderator', value: 'moderator' },
    ],
  },
  { name: 'isActive', label: 'Active', type: 'toggle' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'text',
    render(value) {
      return genders.find((e) => e.value === value)?.label;
    },
    formField: {
      name: 'gender',
      type: 'select',
      options: genders,
    },
  },
  { name: 'loginTime', label: 'Login Time', type: 'time' },
  { name: 'avatarUrl', label: 'Avatar', type: 'img' },
  { name: 'tags', label: 'Tags', type: 'chips', disabled: true },
  {
    name: 'actions',
    label: 'Actions',
    type: 'actions',
    actions: [
      {
        icon: 'edit',
        label: 'Edit',
        onClick: (item) => console.log('Edit', item),
      },
      {
        icon: 'delete',
        label: 'Delete',
        onClick: (item) => console.log('Delete', item),
      },
    ],
    stickyEnd: true,
  },
];
