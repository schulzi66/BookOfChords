import { UserResolver } from './shared/resolvers/user.resolver';
import { BandResolver } from './shared/resolvers/band.resolver';
import { TitleKeyResolver } from './shared/resolvers/title-key.resolver';
import { DemoComponent } from './demo/demo.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TITLEKEYS } from './services/title-key.service';

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
    loadChildren: () => import('./demo/demo.module').then((m) => m.DemoModule),
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.demo }
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
    loadChildren: () => import('./configuration/configuration.module').then((m) => m.ConfigurationModule),
    canActivate: [AuthGuard],
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.configuration }
  },
  {
    path: 'band',
    loadChildren: () => import('./band/band.module').then((m) => m.BandModule),
    canActivate: [AuthGuard],
    resolve: { key: TitleKeyResolver, band: BandResolver },
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
