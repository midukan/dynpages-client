import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { OTPModalPage } from './otp-modal.page'

@NgModule({
  declarations: [
    OTPModalPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // BannerListPage
  ]
})

export class OTPModalPageModule { }
