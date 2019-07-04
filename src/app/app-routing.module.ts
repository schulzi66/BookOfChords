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
		path: 'songs',
		component: SongsOverviewComponent
	},
	{
		path: 'edit-song',
		component: SongDetailsviewComponent
	},
	{
		path: 'gigs',
		loadChildren: './gig/gig.module#GigModule'
	},
	{
		path: 'configuration',
		loadChildren: './configuration/configuration.module#ConfigurationModule'
	},
	{
		path: 'konzertmeister-integration',
		loadChildren: './konzertmeister/konzertmeister-integration.module#KonzertmeisterIntegrationModule'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
