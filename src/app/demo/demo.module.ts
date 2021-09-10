import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { DemoComponent } from './demo.component';
import { DemoRoutes } from './demo.routing';


@NgModule({
  imports: [TranslocoModule, DemoRoutes],
  exports: [],
  declarations: [DemoComponent]
})
export class DemoModule {}
