import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ConvitePage } from './convite.page'

const routes: Routes = [
  {
    path: '',
    component: ConvitePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConviteRoutingModule { }
