import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { PerfilCartaoFormPageModule } from './perfil-cartao-form/perfil-cartao-form.module';
import { PerfilCartaoFormPage } from './perfil-cartao-form/perfil-cartao-form.page';
import { PerfilCartaoListPageModule } from './perfil-cartao-list/perfil-cartao-list.module';
import { PerfilCartaoListPage } from './perfil-cartao-list/perfil-cartao-list.page';
import { PerfilCartaoPageService } from './perfil-cartao-page.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: PerfilCartaoListPage
  },
  {
    path: 'form',
    component: PerfilCartaoFormPage
  },
];

@NgModule({
  imports: [
    PerfilCartaoListPageModule,
    PerfilCartaoFormPageModule,
    // RouterModule.forChild(routes),
  ],
  providers: [
    PerfilCartaoPageService
  ],
  exports: [
  ]
})

export class PerfilCartaoModule { }
