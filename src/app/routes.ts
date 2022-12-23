import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/routes')
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/routes'),
    canActivate: [AuthGuard]
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/routes')
  },
  {
    path: 'gigs',
    loadChildren: () => import('./gig/routes'),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/routes'),
    canActivate: [AuthGuard]
  },
  {
    path: 'band',
    loadChildren: () => import('./band/routes'),
    canActivate: [AuthGuard]
  },
  {
    path: 'exercises',
    loadChildren: () => import('./exercises/routes'),
    canActivate: [AuthGuard]
  }
];
