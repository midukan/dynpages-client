import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { PerfilCartaoFormPageModule } from '../perfil-cartao/perfil-cartao-form/perfil-cartao-form.module'
import { AdminRoutingModule } from './plano-routing.module'
import { PlanoPage } from './plano.page'


@NgModule({
  declarations: [
    PlanoPage,
  ],
  imports: [
    PerfilCartaoFormPageModule,
    SharedModule,
    AdminRoutingModule,
  ],
  providers: [

  ]
})

export class PlanoModule { }
