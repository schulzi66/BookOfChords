import { RouterModule, Routes } from '@angular/router';
import { KonzertmeisterIntegrationComponent } from './konzertmeister-integration.component';

const routes: Routes = [
	{
		path: '',
		component: KonzertmeisterIntegrationComponent
	}
];

export const KonzertmeisterIntegrationRoutes = RouterModule.forChild(routes);
