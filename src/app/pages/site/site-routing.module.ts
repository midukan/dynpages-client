import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WhateverGuard } from 'src/app/guards/whatever.guard';
import { HomePage } from './home/home.page';
import { PoliticaTermosPage } from './politica-termos/politica-termos';
import { SitePage } from './site.page';

const routes: Routes = [
  {
    path: '',
    component: SitePage,
    children: [
      {
        path: '',
        canActivate: [WhateverGuard],
        component: HomePage
      },
      {
        path: 'home/:linkname',
        component: HomePage
      },
      {
        path: 'politica-de-privacidade',
        component: PoliticaTermosPage
      },
      {
        path: 'termos-de-uso',
        component: PoliticaTermosPage
      },
      {
        path: 'conta-digital',
        component: PoliticaTermosPage
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
