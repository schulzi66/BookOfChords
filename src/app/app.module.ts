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
import { firebaseConfig } from 'src/environments/environment';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KonzertmeisterIntegrationModule } from './konzertmeister/konzertmeister-integration.module';
import { AllMaterialModule } from './material-module';
import { SharedUiModule } from './shared-ui/shared-ui.module';
import { SongsModule } from './songs/songs.module';

@NgModule({
	declarations: [AppComponent],
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
		KonzertmeisterIntegrationModule,
		ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
	],
	providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
	bootstrap: [AppComponent]
})
export class AppModule { }
