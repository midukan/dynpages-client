import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImportadorModalPageService } from './importador-page.service';
import { ImportadorModalPageModule } from './importador/importador-modal.module';
import { ImportadorModalPage } from './importador/importador-modal.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'modal',
    pathMatch: 'full'
  },
  {
    path: 'modal',
    component: ImportadorModalPage
  },
];

@NgModule({
  imports: [
    ImportadorModalPageModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ImportadorModalPageService
    // FilterPipe
  ],
  exports: [
    // ImportadorModalPage,
    // ImportadorFormPage,
  ]
})

export class ImportadorModalModule { }
