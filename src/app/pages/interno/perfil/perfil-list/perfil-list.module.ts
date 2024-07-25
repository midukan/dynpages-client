import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

import { PerfilListPage } from './perfil-list.page';

@NgModule({
  declarations: [
    PerfilListPage,
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

export class PerfilListPageModule { }
