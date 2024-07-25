import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { UsuarioListPage } from './usuario-list.page';

@NgModule({
  declarations: [
    UsuarioListPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ]
})

export class UsuarioListPageModule { }
