import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { SETTINGS } from '@angular/fire/compat/firestore';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { translocoConfig, TranslocoModule, TRANSLOCO_CONFIG } from '@ngneat/transloco';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/routes';
import { translocoLoader } from './app/transloco.loader';
import { environment, firebaseConfig } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserAnimationsModule,
            MatSnackBarModule,
            MatBottomSheetModule,
            MatDialogModule,
            TranslocoModule,
            ServiceWorkerModule.register('./ngsw-worker.js', {
                enabled: environment.production,
                registrationStrategy: 'registerWhenStable:30000',
            }),
            AngularFireModule.initializeApp(firebaseConfig),
            //TODO https://github.com/angular/angularfire/tree/master/samples/modular/src/app
            //   provideFirebaseApp(() => initializeApp(firebaseConfig)),
            //   provideFirestore(() => getFirestore()),
            //   provideAuth(() => getAuth())
        ),
        provideHttpClient(),
        provideRouter(appRoutes),
        { provide: SETTINGS, useValue: {} },
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: ['en', 'de'],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: environment.production,
            }),
        },
        translocoLoader,
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: { duration: 3000, panelClass: 'message-snackbar' },
        },
    ],
}).catch(err => console.error(err));
