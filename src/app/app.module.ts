import { SharedUiModule } from './shared-ui/shared-ui.module';
import { AllMaterialModule } from './material-module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChordModule } from './chord/chord.module';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      ChordModule,
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
      ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),   
      AllMaterialModule      
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
