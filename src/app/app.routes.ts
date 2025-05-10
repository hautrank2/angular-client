import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'jobs',
    pathMatch: 'full',
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
  },
  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('./pages/jobs/detail/detail.component').then(
        (m) => m.DetailComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/admin-jobs/admin-jobs.component').then(
            (m) => m.AdminJobsComponent
          ),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('./pages/admin/admin-teams/admin-teams.component').then(
            (m) => m.AdminTeamsComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./pages/admin/admin-members/admin-members.component').then(
            (m) => m.AdminMembersComponent
          ),
      },
    ],
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('./pages/teams/teams.component').then((m) => m.TeamsComponent),
  },
];
