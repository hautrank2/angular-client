import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'jobs',
    pathMatch: 'full',
  },
  {
    path: 'showcase',
    pathMatch: 'full',
    redirectTo: 'showcase/table',
  },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./pages/showcase/showcase.component').then(
        (m) => m.ShowcaseComponent,
      ),
    children: [
      {
        path: 'table',
        loadComponent: () =>
          import(
            './pages/showcase/showcase-table/showcase-table.component'
          ).then((m) => m.ShowcaseTableComponent),
      },
    ],
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
        (m) => m.DetailComponent,
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: 'recruiment',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin/admin-jobs/admin-jobs.component').then(
                (m) => m.AdminJobsComponent,
              ),
          },
          {
            path: 'teams',
            loadComponent: () =>
              import('./pages/admin/admin-teams/admin-teams.component').then(
                (m) => m.AdminTeamsComponent,
              ),
          },
          {
            path: 'members',
            loadComponent: () =>
              import(
                './pages/admin/admin-members/admin-members.component'
              ).then((m) => m.AdminMembersComponent),
          },
        ],
      },
      {
        path: 'pop-corner',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'movies',
          },
          {
            path: 'movies',
            loadComponent: () =>
              import('./pages/admin/pop-corner/movies/movies.component').then(
                (m) => m.MoviesComponent,
              ),
          },
          {
            path: 'artists',
            loadComponent: () =>
              import('./pages/admin/pop-corner/artists/artists.component').then(
                (m) => m.ArtistsComponent,
              ),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/pop-corner/users/users.component').then(
                (m) => m.UsersComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('./pages/teams/teams.component').then((m) => m.TeamsComponent),
  },
];
