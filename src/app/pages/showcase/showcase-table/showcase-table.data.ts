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

export const TABLE_COLUMNS: ShColumn[] = [
  { key: 'id', label: 'ID', type: 'text' },
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'createdAt', label: 'Created Date', type: 'date' },
  // {
  //   key: 'iconText',
  //   label: 'Info',
  //   type: 'iconText',
  //   icon: { name: 'info', color: 'primary' },
  //   actionConfig: { type: 'button', action: (item) => console.log(item) },
  // },
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
  },
  // {
  //   key: 'statuses',
  //   label: 'Multiple Status',
  //   type: 'statusList',
  //   statusData: {
  //     active: { iconName: 'check', label: 'Active', color: 'green' },
  //     warning: { iconName: 'warning', label: 'Warning', color: 'orange' },
  //     error: { iconName: 'error', label: 'Error', color: 'red' },
  //   },
  // },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
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
  // {
  //   key: 'actions',
  //   label: 'Actions',
  //   type: 'actions',
  //   actionType: 'menu',
  //   actions: [
  //     {
  //       icon: 'edit',
  //       label: 'Edit',
  //       callback: (item) => console.log('Edit', item),
  //     },
  //     {
  //       icon: 'delete',
  //       label: 'Delete',
  //       callback: (item) => console.log('Delete', item),
  //     },
  //   ],
  // },
];
