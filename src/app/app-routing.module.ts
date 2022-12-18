import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TITLEKEYS } from './services/title-key.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { TitleKeyResolver } from './shared/resolvers/title-key.resolver';

const routes: Routes = [
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
    loadChildren: () => import('./gig/gig.module').then((m) => m.GigModule),
    canActivate: [AuthGuard],
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.gigs }
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/routes'),
    canActivate: [AuthGuard]
  },
  {
    path: 'band',
    loadChildren: () => import('./band/band.module').then((m) => m.BandModule),
    canActivate: [AuthGuard],
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.band }
  },
  {
    path: 'exercises',
    loadChildren: () => import('./exercises/exercises.module').then((m) => m.ExercisesModule),
    canActivate: [AuthGuard],
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.exercises }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
