// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const SERVER_ADDR = 'http://192.168.0.96:3000'
// const SERVER_ADDR = 'http://192.168.0.103:3000'
const SERVER_ADDR = 'http://localhost:3000'
const SOCKET_ADDR = 'http://localhost:3000';

export const environment: any = {

  name: 'development',

  production: false,
  hmr: false,

  build: {
    frontendCommit: '__replaceCGC__',
    frontendDate: '__replaceDate__'
  },

  keys: {
    RECAPTCHA_CLIENT_KEY: '',
  },

  enums: {
    IdDataSocket: {
      INIT: 'INIT',
      INFO: 'INFO',
      ADMIN_STATS: 'ADMIN_STATS',
      SERVER_INFO: 'SERVER_INFO',
      AUTH_UPD: 'AUTH_UPD',
      LIST_REFRESH: 'LIST_REFRESH',
    }
  },

  paths: {
    endpointURL: SERVER_ADDR,
    socketURL: SOCKET_ADDR,
    noAuthUrl: '/auth',
    noAuthUrlAdmin: '/auth',
    isAuthUrl: '/painel',
    isAuthUrlAdmin: '/painel',
  },

  request: {
    retryDelay: 1000, // apenas em req. seguras p/ retries
    totalRetries: 5, // todas req.
    timeoutErroPadrao: {
      title: 'Sem conexão!',
      message: 'Verifique sua conexão com a internet.',
    },
    erroPadrao: {
      title: 'Erro de servidor!',
      message: 'Tente novamente ou entre em contato conosco.',
    },
  },

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
