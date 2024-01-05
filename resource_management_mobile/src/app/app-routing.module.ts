import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: 'client',
        loadChildren: () =>
          import('./pages/client/client.module').then(
            (m) => m.ClientPageModule
          ),
      },
      {
        path: 'partner',
        loadChildren: () =>
          import('./pages/partner/partner.module').then(
            (m) => m.PartnerPageModule
          ),
      },
      {
        path: 'resource',
        loadChildren: () =>
          import('./pages/resource/resource.module').then(
            (m) => m.ResourcePageModule
          ),
      },
      {
        path: 'requirement',
        loadChildren: () =>
          import('./pages/requirement/requirement.module').then(
            (m) => m.RequirementPageModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: 'status-tracker',
        loadChildren: () =>
          import('./pages/status-tracker/status-tracker.module').then(
            (m) => m.StatusTrackerPageModule
          ),
      },
      {
        path: 'resource-requirement',
        loadChildren: () =>
          import(
            './pages/resource-requirement/resource-requirement.module'
          ).then((m) => m.ResourceRequirementPageModule),
      },
      {
        path: 'resource-hiring',
        loadChildren: () =>
          import('./pages/resource-hiring/resource-hiring.module').then(
            (m) => m.ResourceHiringPageModule
          ),
      },
      {
        path: 'skill',
        loadChildren: () =>
          import('./pages/skill/skill.module').then((m) => m.SkillPageModule),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./pages/location/location.module').then(
            (m) => m.LocationPageModule
          ),
      },
      {
        path: 'bench',
        loadChildren: () =>
          import('./pages/bench-resource/bench-resource.module').then(
            (m) => m.BenchResourcePageModule
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/notifications/notifications.module').then(
            (m) => m.NotificationsPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
    ],
  },
  {
    path: 'bench-resource',
    loadChildren: () => import('./pages/bench-resource/bench-resource.module').then(m => m.BenchResourcePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
