import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanoPage } from './plano.page';

const routes: Routes = [
  {
    path: '',
    component: PlanoPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
