import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { ProjetoListPage } from './projeto-list.page'

@NgModule({
  declarations: [
    ProjetoListPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // ProjetoListPage
  ]
})

export class ProjetoListPageModule { }
