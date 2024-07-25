import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContratoUsuarioFormPageModule } from './contrato-usuario-form/contrato-usuario-form.module';
import { ContratoUsuarioFormPage } from './contrato-usuario-form/contrato-usuario-form.page';
import { ContratoUsuarioListPageModule } from './contrato-usuario-list/contrato-usuario-list.module';
import { ContratoUsuarioListPage } from './contrato-usuario-list/contrato-usuario-list.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ContratoUsuarioListPage
  },
  {
    path: 'form',
    component: ContratoUsuarioFormPage
  },
];

@NgModule({
  imports: [
    ContratoUsuarioListPageModule,
    ContratoUsuarioFormPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    // FilterPipe
  ]
})

export class ContratoUsuarioModule { }
