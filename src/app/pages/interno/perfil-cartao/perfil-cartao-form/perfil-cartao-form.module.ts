import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { PerfilCartaoFormPage } from './perfil-cartao-form.page';


@NgModule({
  declarations: [
    PerfilCartaoFormPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    PerfilCartaoFormPage,
    // PerfilFormPage
  ]
})

export class PerfilCartaoFormPageModule { }
