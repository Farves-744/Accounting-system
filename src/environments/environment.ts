// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    BASE_URL: 'http://192.168.1.60:3000',
    // TOKEN: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtbWVkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWJjMTIzIiwiaWF0IjoxNjgwOTUzMjAxfQ.S6_UZaDyeEFsZ4PSJXV13SKStRbSkl6elqfVLvS6sAA',

    SECRET_KEY: 'my-secret-key-is-safe',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
