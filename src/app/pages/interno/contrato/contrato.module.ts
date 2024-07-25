import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContratoFormPageModule } from './contrato-form/contrato-form.module';
import { ContratoFormPage } from './contrato-form/contrato-form.page';
import { ContratoListPageModule } from './contrato-list/contrato-list.module';
import { ContratoListPage } from './contrato-list/contrato-list.page';
import { ContratoPageService } from './contrato-page.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ContratoListPage
  },
  {
    path: 'form',
    component: ContratoFormPage
  },
];

@NgModule({
  imports: [
    ContratoListPageModule,
    ContratoFormPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ContratoPageService
  ]
})

export class ContratoModule { }
