import { DocumentResponse } from './query';

export interface Team extends DocumentResponse {
  name: string;
  description: string;
  createdAt: string;
  members?: TeamMember[];
}

export interface TeamMember extends DocumentResponse {
  name: string;
  birthday: string; // YYYY-MM-DD
  nickname: string;
  description: string;
  avatar: string;
  email: string;
  roles: TeamRole[];
  hobbies: string[];
  socials: Social[];
}

export interface Social {
  platform: string;
  url: string;
}

export type TeamRole =
  | 'Frontend'
  | 'Backend'
  | 'Fullstack'
  | 'Designer'
  | 'DevOps'
  | 'QA'
  | 'PO'
  | 'PM'
  | 'BA'
  | 'Intern'
  | 'Unity';

export const TEAM_ROLES: TeamRole[] = [
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
