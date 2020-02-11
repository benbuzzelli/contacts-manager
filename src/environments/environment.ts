// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  create: 'https://contacts-manager-990c3.firebaseapp.com/app/api/create',
  readId: 'https://contacts-manager-990c3.firebaseapp.com/app/api/read',
  readAll: 'https://contacts-manager-990c3.firebaseapp.com/app/api/read',
  update: 'https://contacts-manager-990c3.firebaseapp.com/app/api/update',
  delete: 'https://contacts-manager-990c3.firebaseapp.com/app/api/delete',
  firebase: {
    apiKey: "AIzaSyChcsiQf01F5BFLCjzoSXv3XTU2Zz2maDQ",
    authDomain: "contacts-manager-990c3.firebaseapp.com",
    databaseURL: "https://contacts-manager-990c3.firebaseio.com",
    projectId: "contacts-manager-990c3",
    storageBucket: "contacts-manager-990c3.appspot.com",
    messagingSenderId: "969034714296",
    appId: "1:969034714296:web:511a4ec4b3d3a45f7f784d",
    measurementId: "G-1J17VW1Q01"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
