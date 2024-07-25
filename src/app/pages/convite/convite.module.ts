import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { ConviteRoutingModule } from './convite-routing.module'
import { ConvitePage } from './convite.page'

@NgModule({
  declarations: [
    ConvitePage,
  ],
  imports: [
    SharedModule,
    ConviteRoutingModule
  ],
  providers: [

  ]
})

export class ConvitePageModule { }
