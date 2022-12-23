import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { LoginComponent } from './login.component';

export default [
  {
    path: '',
    component: LoginComponent,
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.default }
  }
] as Route[];
