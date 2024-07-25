import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OTPModalPageService } from './otp-page.service';
import { OTPModalPageModule } from './otp/otp-modal.module';
import { OTPModalPage } from './otp/otp-modal.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'modal',
    pathMatch: 'full'
  },
  {
    path: 'modal',
    component: OTPModalPage
  },
];

@NgModule({
  imports: [
    OTPModalPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    OTPModalPageService
    // FilterPipe
  ],
  exports: [
    // OTPModalPage,
    // OTPFormPage,
  ]
})

export class OTPModalModule { }
