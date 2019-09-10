import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslocoConfig, TranslocoModule, TRANSLOCO_CONFIG } from '@ngneat/transloco';
import { firebaseConfig } from 'src/environments/environment';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllMaterialModule } from './material-module';
import { SharedUiModule } from './shared-ui/shared-ui.module';
import { SongsModule } from './songs/songs.module';
import { translocoLoader } from './transloco.loader';

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		SongsModule,
		SharedUiModule,
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireStorageModule,
		HttpClientModule,
		AllMaterialModule,
		ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
		TranslocoModule
	],
	providers: [
		{ provide: FirestoreSettingsToken, useValue: {} },
		{
			provide: TRANSLOCO_CONFIG,
			useValue: {
				listenToLangChange: true,
				defaultLang: 'en',
				fallbackLang: 'de',
				prodMode: environment.production,
				scopeStrategy: 'shared'
			} as TranslocoConfig
		},
		translocoLoader
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
