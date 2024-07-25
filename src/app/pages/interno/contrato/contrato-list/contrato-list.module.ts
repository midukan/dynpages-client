import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared.module';

import { ContratoFormPageModule } from '../contrato-form/contrato-form.module';
import { ContratoListPage } from './contrato-list.page';

@NgModule({
  declarations: [
    ContratoListPage,
  ],
  imports: [
    SharedModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ContratoFormPageModule,
  ],
  providers: [
    // FilterPipe
  ]
})

export class ContratoListPageModule { }
