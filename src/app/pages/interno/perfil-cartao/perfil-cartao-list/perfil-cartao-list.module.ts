import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { PerfilCartaoListPage } from './perfil-cartao-list.page';

@NgModule({
  declarations: [
    PerfilCartaoListPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    // FilterPipe
  ],
  exports: [
    // PerfilListPage
  ]
})

export class PerfilCartaoListPageModule { }
