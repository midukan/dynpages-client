import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeAdminPage } from './home.page'

const routes: Routes = [
  {
    path: '',
    component: HomeAdminPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
