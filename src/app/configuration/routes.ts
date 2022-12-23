import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { ConfigurationComponent } from './configuration/configuration.component';

export default [
  {
    path: '',
    component: ConfigurationComponent,
    resolve: {
      key: TitleKeyResolver,
      drawerAction: DrawerActionResolver
    },
    data: { key: TITLEKEYS.configuration }
  }
] as Route[];
