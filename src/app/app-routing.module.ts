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
    path: 'demo',
    component: DemoComponent,
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.demo }
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.module').then((m) => m.SongsModule),
    canActivate: [AuthGuard],
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
