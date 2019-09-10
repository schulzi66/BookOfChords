import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange, MatSlideToggleChange } from '@angular/material';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-configuration',
	templateUrl: './configuration.component.html',
	styleUrls: [ './configuration.component.scss' ]
})
export class ConfigurationComponent implements OnInit {
	private _configurationService: ConfigurationService;
	private _authService: AuthService;
	private _location: Location;
	private _translocoService: TranslocoService;

	public configuration: Configuration;

	constructor(
		configurationService: ConfigurationService,
		authService: AuthService,
		location: Location,
		translocoService: TranslocoService
	) {
		this._configurationService = configurationService;
		this._authService = authService;
		this._location = location;
		this._translocoService = translocoService;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
				if (configuration === undefined) {
					this.configuration = new Configuration(user.uid);
				} else {
					this.configuration = configuration;
				}
				this._translocoService.setActiveLang(this.configuration.lang);
			});
		});
	}

	public fontSizeHeaderChanged(event: MatSelectChange): void {
		this.configuration.fontSizeHeader = event.value;
		this._configurationService.saveConfigurationForUser(this.configuration);
	}

	public fontSizeSectionChanged(event: MatSelectChange): void {
		this.configuration.fontSizeSection = event.value;
		this._configurationService.saveConfigurationForUser(this.configuration);
	}

	public fontFamilyChanged(event: MatSelectChange): void {
		this.configuration.fontFamily = event.value;
		this._configurationService.saveConfigurationForUser(this.configuration);
	}

	public useKonzertmeisterChanged(event: MatSlideToggleChange): void {
		this.configuration.useKonzertmeister = event.checked;
		this._configurationService.saveConfigurationForUser(this.configuration);
	}

	public langChanged(event: MatSelectChange): void {
		this.configuration.lang = event.value;
		this._configurationService.saveConfigurationForUser(this.configuration);
	}

	public goBack(): void {
		this._location.back();
	}
}
