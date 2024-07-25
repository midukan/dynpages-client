import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { UsuarioFormPageModule } from './usuario-form/usuario-form.module'
import { UsuarioFormPage } from './usuario-form/usuario-form.page'
import { UsuarioListPageModule } from './usuario-list/usuario-list.module'
import { UsuarioListPage } from './usuario-list/usuario-list.page'
import { UsuarioPageService } from './usuario-page.service'

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'list',
  //   pathMatch: 'full'
  // },
  {
    path: '', // para criar / rec senha conta apenas
    component: UsuarioFormPage
  },
  {
    path: 'list',
    component: UsuarioListPage
  },
  {
    path: 'form',
    component: UsuarioFormPage
  },
];

@NgModule({
  imports: [
    UsuarioListPageModule,
    UsuarioFormPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    UsuarioPageService
  ]
})

export class UsuarioModule { }
