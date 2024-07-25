import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { PoliticaTermosPage } from './politica-termos'
import { PoliticaTermosPageService } from './politica-termos-page.service'

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    PoliticaTermosPage
  ],
  providers: [
    PoliticaTermosPageService
  ],
  exports: [
  ]
})
export class PoliticaTermosModule {
}
