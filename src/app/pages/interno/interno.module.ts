import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { CidadeModule } from './cidade/cidade.module'
import { InternoRoutingModule } from './interno-routing.module'
import { InternoPage } from './interno.page'

@NgModule({
  declarations: [
    InternoPage,
  ],
  imports: [
    SharedModule,
    CidadeModule,
    InternoRoutingModule,
  ],
  providers: [
    // FilterPipe
  ]
})

export class InternoPageModule { }
