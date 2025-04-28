export type JobType = 'Full-time' | 'Part-time' | 'Hybrid';

export interface Job {
  id: string;
  title: string;
  location: string;
  type: JobType;
  description: string;
  skills: string[]; // array of skill keys, ví dụ: ['angular', 'node']
  requirement: string[];
  benefit: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  key: string; // ví dụ: 'node', 'angular'
  title: string; // tên hiển thị: 'Node.js', 'Angular'
  logo: string; // link hình logo
}
