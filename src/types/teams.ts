export interface Team {
  _id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  nickname: string;
  avatar: string;
  email: string;
  role: string;
  hobbies: string[];
  social: Social[];
  createdAt: string;
  updatedAt: string;
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
  | 'PM';

export const TEAM_ROLES: TeamRole[] = [
  'Frontend',
  'Backend',
  'Fullstack',
  'Designer',
  'DevOps',
  'QA',
  'PM',
];
