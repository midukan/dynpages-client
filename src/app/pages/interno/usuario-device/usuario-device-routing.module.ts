import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { UsuarioDevicePage } from './usuario-device.page'

const routes: Routes = [
  {
    path: '',
    component: UsuarioDevicePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsuarioDeviceRoutingModule { }
