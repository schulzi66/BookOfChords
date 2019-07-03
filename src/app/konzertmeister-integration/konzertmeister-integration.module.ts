import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KonzertmeisterIntegrationComponent } from './konzertmeister-integration.component';
import { KonzertmeisterIntegrationRoutes } from './konzertmeister-integration.routing';

@NgModule({
	imports: [ CommonModule, KonzertmeisterIntegrationRoutes ],
	declarations: [ KonzertmeisterIntegrationComponent ],
	exports: [ KonzertmeisterIntegrationComponent ]
})
export class KonzertmeisterIntegrationModule {}
