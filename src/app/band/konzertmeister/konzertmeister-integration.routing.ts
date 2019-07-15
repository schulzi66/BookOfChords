import { RouterModule, Routes } from '@angular/router';
import { KonzertmeisterIntegrationComponent } from './konzertmeister-integration/konzertmeister-integration.component';

const routes: Routes = [
	{
		path: 'konzertmeister',
		component: KonzertmeisterIntegrationComponent
	}
];

export const KonzertmeisterIntegrationRoutes = RouterModule.forChild(routes);
