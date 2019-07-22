import { RouterModule, Routes } from '@angular/router';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandSetlistEditComponent } from './band-setlist-edit/band-setlist-edit.component';

const routes: Routes = [
	{
		path: '',
		component: BandOverviewComponent
	},
	{
		path: 'edit/:id',
		component: BandEditComponent
	},
	{
		path: 'setlist/edit/:id',
		component: BandSetlistEditComponent
	}
];

export const BandRoutes = RouterModule.forChild(routes);
