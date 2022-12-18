import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TITLEKEYS } from './services/title-key.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { DrawerActionResolver } from './shared/resolvers/drawer-action.resolver';
import { TitleKeyResolver } from './shared/resolvers/title-key.resolver';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.default }
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.module').then((m) => m.SongsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/routes'),
    resolve: {
      key: TitleKeyResolver,
      drawerAction: DrawerActionResolver
    },
    data: {
      key: TITLEKEYS.demo,
      isBaseDrawerAction: true
    }
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
    canActivate: [AuthGuard],
    resolve: {
      key: TitleKeyResolver,
      drawerAction: DrawerActionResolver
    },
    data: { key: TITLEKEYS.configuration }
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
