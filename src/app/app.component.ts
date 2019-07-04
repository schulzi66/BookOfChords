import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { ConfigurationService } from './configuration/services/configuration.service';
import { Configuration } from './models/configuration.model';
import { AuthService } from './services/auth.service';
import { PwaService } from './services/pwa.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public title: string;
    public authService: AuthService;
    public pwaService: PwaService;
    public configuration: Configuration;

    private _configurationService: ConfigurationService;

    constructor(authService: AuthService, pwaService: PwaService, configurationServcie: ConfigurationService) {
        this.authService = authService;
        this.pwaService = pwaService
        this._configurationService = configurationServcie;
    }

    ngOnInit(): void {
        this.title = 'Book of Chords';
        this.authService.user$.subscribe((user: User) => {
            this._configurationService.loadConfigurationForUser(user.uid)
                .subscribe((configuration: Configuration) => {
                    this.configuration = configuration;
                });
        });
    }

    installPwa(): void {
        this.pwaService.promptEvent.prompt();
    }
}
