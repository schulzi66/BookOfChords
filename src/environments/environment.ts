// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const firebaseConfig = {
  apiKey: "**Insert Key here**",
  authDomain: "book-of-chords.firebaseapp.com",
  databaseURL: "**Insert database url here**",
  projectId: "**Insert project id here**",
  storageBucket: "**Insert storage bucket here**",
  messagingSenderId: "**Insert massaging sender id here**"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
