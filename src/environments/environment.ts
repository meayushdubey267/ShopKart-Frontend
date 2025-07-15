// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  shopKartApiUrl: 'https://localhost:8443/api',
  stripePublishableKey: 'pk_test_51RfEQyB99UNaOgXS34g0lnDOwr24hEEOd2VWSv4yDsOhzlqd3bwF25wqeqkQ3PBE5VipmEopnaaG7hEI9U0UwusJ00WNddH0oJ',
  auth0: {
    domain: 'dev-5s0kqebmrbddvuh3.us.auth0.com',
    clientId: 'a5IEO2kt3vUQYPzXqitaZiOUSjrYI4PI',
    redirectUri: 'https://localhost:4200/login/callback',
    audience: 'http://localhost:8080',
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase',
    ]
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.