import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { UsuarioDeviceRoutingModule } from './usuario-device-routing.module'
import { UsuarioDevicePage } from './usuario-device.page'

@NgModule({
  declarations: [
    UsuarioDevicePage,
  ],
  imports: [
    SharedModule,
    UsuarioDeviceRoutingModule
  ],
  providers: [

  ]
})

export class UsuarioDevicePageModule { }
