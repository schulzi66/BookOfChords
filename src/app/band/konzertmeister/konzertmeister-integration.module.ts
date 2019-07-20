import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KonzertmeisterIntegrationRoutes } from './konzertmeister-integration.routing';
import { KonzertmeisterIntegrationComponent } from './konzertmeister-integration/konzertmeister-integration.component';

@NgModule({
	imports: [ CommonModule, KonzertmeisterIntegrationRoutes ],
	declarations: [ KonzertmeisterIntegrationComponent ],
	exports: [ KonzertmeisterIntegrationComponent ]
})
export class KonzertmeisterIntegrationModule {}
