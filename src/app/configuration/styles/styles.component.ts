import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { MatSelectChange } from '@angular/material';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-styles',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss']
})
export class StylesComponent implements OnInit {

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
        if(configuration === undefined) {
          this.configuration = new Configuration(user.uid);
        } else {
          this.configuration = configuration;
        }
      })
    })
  }

  public fontSizeHeaderChanged(event: MatSelectChange) {
    this.configuration.fontSizeHeader = event.value;
  }

  public fontSizeSectionChanged(event: MatSelectChange) {
    this.configuration.fontSizeSection = event.value;
  }

  public goBack(): void {
    this._configurationService.saveConfigurationForUser(this.configuration);
    this._location.back();
  }
}
