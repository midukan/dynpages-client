import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { UsuarioFormPage } from './usuario-form.page';

@NgModule({
  declarations: [
    UsuarioFormPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ]
})

export class UsuarioFormPageModule { }
