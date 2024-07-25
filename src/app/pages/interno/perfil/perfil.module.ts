import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PerfilFormPageModule } from './perfil-form/perfil-form.module';
import { PerfilFormPage } from './perfil-form/perfil-form.page';
import { PerfilListPageModule } from './perfil-list/perfil-list.module';
import { PerfilListPage } from './perfil-list/perfil-list.page';
import { PerfilPageService } from './perfil-page.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: PerfilListPage
  },
  {
    path: 'form', // para criar conta apenas
    component: PerfilFormPage
  },
];

@NgModule({
  imports: [
    PerfilListPageModule,
    PerfilFormPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    PerfilPageService
    // FilterPipe
  ],
  exports: [
    // PerfilListPage,
    // PerfilFormPage,
  ]
})

export class PerfilModule { }
