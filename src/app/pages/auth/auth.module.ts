import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';


@NgModule({
  declarations: [
    AuthPage,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.keys?.RECAPTCHA_CLIENT_KEY,
      } as RecaptchaSettings,
    },
  ]
})
export class AuthPageModule { }
