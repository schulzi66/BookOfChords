import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { INavbarAction } from 'src/app/models/navbar-action';
import { NavbarActionService } from '../services/navbar-action.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class DemoComponent {
  private _mode: string;

  private _toggleDarkModeAction: INavbarAction = {
    order: 100,
    icon: 'dark_mode',
    action: () => this.switchMode()
  };

  private _toggleLightModeAction: INavbarAction = {
    order: 100,
    icon: 'light_mode',
    action: () => this.switchMode()
  };

  private _toggleLanguageAction: INavbarAction = {
    order: 200,
    icon: 'language',
    action: () => {
      if (this._translocoService.getActiveLang() === 'en') {
        this._translocoService.setActiveLang('de');
        this._snackbarService.show({ message: 'Deutsch' });
      } else {
        this._translocoService.setActiveLang('en');
        this._snackbarService.show({ message: 'English' });
      }
    }
  };

  public get mode(): string {
    return this._mode;
  }

  constructor(
    private _configurationService: ConfigurationService,
    private _navbarActionService: NavbarActionService,
    private _translocoService: TranslocoService,
    private _snackbarService: SnackbarService
  ) {
    this._mode = this._configurationService.useDarkMode ? 'dark' : 'light';
    this.registerNavbarActions();
  }

  private switchMode(): void {
    this._navbarActionService.resetActions();
    this._mode === 'dark' ? (this._mode = 'light') : (this._mode = 'dark');
    this.registerNavbarActions();
  }

  private registerNavbarActions(): void {
    this._navbarActionService.registerActions([
      this._mode === 'dark' ? this._toggleLightModeAction : this._toggleDarkModeAction,
      this._toggleLanguageAction
    ]);
  }
}
