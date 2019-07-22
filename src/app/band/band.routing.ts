import { RouterModule, Routes } from '@angular/router';
import { BandOverviewComponent } from './band-overview/band-overview.component';

const routes: Routes = [
	{
		path: '',
		component: BandOverviewComponent
	}
];

export const BandRoutes = RouterModule.forChild(routes);
