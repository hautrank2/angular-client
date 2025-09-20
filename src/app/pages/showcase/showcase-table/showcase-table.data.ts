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

export const TABLE_COLUMNS: ShColumn<any>[] = [
  { key: 'id', label: 'ID', type: 'text', sticky: true },
  { key: 'name', label: 'Name', type: 'text', sticky: true },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    formField: {
      key: 'age',
      type: 'number',
    },
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date',
    formField: {
      key: 'createdAt',
      type: 'dateTime',
    },
  },
  {
    key: 'status',
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
      key: 'status',
      type: 'select',
      options: status.map((e) => ({ value: e.value, label: e.label })),
    },
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Moderator', value: 'moderator' },
    ],
  },
  { key: 'isActive', label: 'Active', type: 'toggle' },
  {
    key: 'gender',
    label: 'Gender',
    type: 'text',
  },
  { key: 'loginTime', label: 'Login Time', type: 'time' },
  { key: 'avatarUrl', label: 'Avatar', type: 'img' },
  { key: 'tags', label: 'Tags', type: 'chips' },
  {
    key: 'actions',
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
