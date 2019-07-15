import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange, MatSlideToggleChange } from '@angular/material';
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

	public configuration: Configuration;

	constructor(configurationService: ConfigurationService, authService: AuthService, location: Location) {
		this._configurationService = configurationService;
		this._authService = authService;
		this._location = location;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
				if (configuration === undefined) {
					this.configuration = new Configuration(user.uid);
				} else {
					this.configuration = configuration;
				}
			});
		});
	}

	public fontSizeHeaderChanged(event: MatSelectChange): void {
		this.configuration.fontSizeHeader = event.value;
	}

	public fontSizeSectionChanged(event: MatSelectChange): void {
		this.configuration.fontSizeSection = event.value;
	}

	public fontFamilyChanged(event: MatSelectChange): void {
		this.configuration.fontFamily = event.value;
	}

	public useKonzertmeisterChanged(event: MatSlideToggleChange): void {
		this.configuration.useKonzertmeister = event.checked;
	}

	public goBack(): void {
		this._configurationService.saveConfigurationForUser(this.configuration);
		this._location.back();
	}
}
