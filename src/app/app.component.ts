import { Component, OnInit } from '@angular/core';
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

	constructor(authService: AuthService, pwaService: PwaService) {
		this.authService = authService;
		this.pwaService = pwaService;
	}

	ngOnInit(): void {
		this.title = 'Book of Chords';
	}

	installPwa(): void {
		this.pwaService.promptEvent.prompt();
	}
}
