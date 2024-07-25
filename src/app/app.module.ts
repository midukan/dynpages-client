import { registerLocaleData } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import localePt from '@angular/common/locales/pt'
import { LOCALE_ID, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouteReuseStrategy } from '@angular/router'
import { ServiceWorkerModule } from '@angular/service-worker'
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SocketIoModule } from 'ngx-socket-io'
import { SharedModule } from 'src/app/shared.module'
import { environment } from 'src/environments/environment'

import { AppRoutingModule } from './app-routing.module'
import { AppUtil } from './app-util'
import { AppComponent } from './app.component'
import { MainInterceptor } from './interceptors/main-interceptor'
import { ContratoModule } from './pages/interno/contrato/contrato.module'
import { ImportadorModalModule } from './pages/interno/importador/importador.module'
import { OTPModalModule } from './pages/interno/otp/otp.module'
import { PerfilCartaoModule } from './pages/interno/perfil-cartao/perfil-cartao.module'
import { StorageService } from './providers/storage.service'


// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

registerLocaleData(localePt, 'pt')
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    // IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    SocketIoModule.forRoot({ url: environment.paths.socketURL, options: {} }),
    IonicModule.forRoot({
      backButtonText: '',
      sanitizerEnabled: true,
      innerHTMLTemplatesEnabled: true,
      // backButtonIcon: 'arrow-back-circle-outline',
      mode: 'md',
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: storage => {
          return {
            tokenGetter: async () => {
              return await storage.get('access_token');
            },
            allowedDomains: [environment.paths.endpointURL.split('//')[1], environment.paths.socketURL.split('//')[1]],
            // blacklistedRoutes: ['auth/login']
          };
        },
        deps: [StorageService]
      }
    }),
    // NgxIndexedDBModule.forRoot({
    //   name: 'BetFielDB',
    //   version: 1,
    //   objectStoresMeta: [{
    //     store: 'keyValue',
    //     storeConfig: { keyPath: 'key', autoIncrement: false },
    //     storeSchema: [
    //       { name: 'key', keypath: 'key', options: { unique: true } },
    //       { name: 'value', keypath: 'value', options: { unique: false } },
    //     ]
    //   }]
    // }),
    // NoopAnimationsModule,\
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      // enabled: !isDevMode(),
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      // registrationStrategy: 'registerWhenStable:30000'
    }),

    PerfilCartaoModule,
    OTPModalModule,
    ImportadorModalModule,
    ContratoModule,
  ],
  providers: [
    // FirebaseX,
    AppUtil,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

