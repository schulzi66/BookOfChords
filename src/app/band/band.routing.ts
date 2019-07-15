import { RouterModule, Routes } from '@angular/router';
import { BandOverviewComponent } from './band-overview/band-overview.component';

const routes: Routes = [
	{
		path: '',
		component: BandOverviewComponent
	},
	{
		path: 'konzertmeister',
		loadChildren: './konzertmeister/konzertmeister-integration.module#KonzertMeisterIntegrationModule'
	}
];

export const BandRoutes = RouterModule.forChild(routes);
