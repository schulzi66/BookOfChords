import { RouterModule, Routes } from '@angular/router';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';

const routes: Routes = [
	{
		path: '',
		component: BandOverviewComponent
	},
	{
		path: 'edit/:id',
		component: BandEditComponent
	}
];

export const BandRoutes = RouterModule.forChild(routes);
