import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ConfigListPageModule } from './config-list/config-list.module'
import { ConfigListPage } from './config-list/config-list.page'
import { ConfigPageService } from './config-page.service'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ConfigListPage
  },
];

@NgModule({
  imports: [
    ConfigListPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ConfigPageService
    // FilterPipe
  ],
  exports: [
    // ConfigListPage,
    // ConfigFormPage,
  ]
})

export class ConfigModule { }
