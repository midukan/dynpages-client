import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { ProjetoFormPage } from './projeto-form.page'

@NgModule({
  declarations: [
    ProjetoFormPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // ProjetoFormPage
  ]
})

export class ProjetoFormPageModule { }
