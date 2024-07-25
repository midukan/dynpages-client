import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { ConfigListPage } from './config-list.page'

@NgModule({
  declarations: [
    ConfigListPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // ConfigListPage
  ]
})

export class ConfigListPageModule { }
