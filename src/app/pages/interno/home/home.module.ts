import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { AdminRoutingModule } from './home-routing.module'
import { HomeAdminPage } from './home.page'


@NgModule({
  declarations: [
    HomeAdminPage,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  providers: [

  ]
})

export class HomeAdminModule { }
