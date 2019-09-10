import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from './models/configuration';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { PwaService } from './services/pwa.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
	public title: string;
	public authService: AuthService;
	public pwaService: PwaService;

	private _configurationService: ConfigurationService;
	private _translocoService: TranslocoService;

	constructor(
		authService: AuthService,
		pwaService: PwaService,
		configurationService: ConfigurationService,
		translocoService: TranslocoService
	) {
		this.authService = authService;
		this.pwaService = pwaService;
		this._configurationService = configurationService;
		this._translocoService = translocoService;
	}

	ngOnInit(): void {
		this.title = 'Book of Chords';
		this.authService.user$.subscribe((user: User) => {
			this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
				this._translocoService.setActiveLang(configuration.lang);
			});
		});
	}

	installPwa(): void {
		this.pwaService.promptEvent.prompt();
	}
}
