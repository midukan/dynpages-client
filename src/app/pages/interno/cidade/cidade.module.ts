import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CidadeListPageModule } from './cidade-list/cidade-list.module'
import { CidadeListPage } from './cidade-list/cidade-list.page'
import { CidadePageService } from './cidade-page.service'

const routes: Routes = [
  {
    path: 'list',
    component: CidadeListPage
  },
];

@NgModule({
  imports: [
    CidadeListPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    CidadePageService
    // FilterPipe
  ],
  exports: [
    // CidadeListPage,
    // CidadeFormPage,
  ]
})

export class CidadeModule { }
