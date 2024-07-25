import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { PerfilFormPage } from './perfil-form.page';

@NgModule({
  declarations: [
    PerfilFormPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // PerfilFormPage
  ]
})

export class PerfilFormPageModule { }
