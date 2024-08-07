import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProjetoFormPageModule } from './projeto-form/projeto-form.module'
import { ProjetoFormPage } from './projeto-form/projeto-form.page'
import { ProjetoListPageModule } from './projeto-list/projeto-list.module'
import { ProjetoListPage } from './projeto-list/projeto-list.page'
import { ProjetoPageService } from './projeto-page.service'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ProjetoListPage
  },
  {
    path: 'form', // para criar conta apenas
    component: ProjetoFormPage
  },
];

@NgModule({
  imports: [
    ProjetoListPageModule,
    ProjetoFormPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ProjetoPageService
    // FilterPipe
  ],
  exports: [
    // ProjetoListPage,
    // ProjetoFormPage,
  ]
})

export class ProjetoModule { }
