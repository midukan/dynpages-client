import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { CidadeListPage } from './cidade-list.page'

@NgModule({
  declarations: [
    CidadeListPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // CidadeListPage
  ]
})

export class CidadeListPageModule { }
