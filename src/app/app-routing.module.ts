import { DrawerActionResolver } from './shared/resolvers/drawer-action.resolver';
import { BandService } from 'src/app/band/services/band.service';
import { DemoComponent } from './demo/demo.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SongDetailsviewComponent } from './songs/song-detailsview/song-detailsview.component';
import { SongsOverviewComponent } from './songs/songs-overview/songs-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.module').then((m) => m.SongsModule),
    canActivate: [AuthGuard],

  },
  {
    path: 'gigs',
    loadChildren: () => import('./gig/gig.module').then((m) => m.GigModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/configuration.module').then((m) => m.ConfigurationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'band',
    loadChildren: () => import('./band/band.module').then((m) => m.BandModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
