import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { ImportadorModalPage } from './importador-modal.page'

@NgModule({
  declarations: [
    ImportadorModalPage,
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

export class ImportadorModalPageModule { }
