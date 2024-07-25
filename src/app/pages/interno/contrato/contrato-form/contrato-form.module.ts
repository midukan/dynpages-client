import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared.module';

import { ContratoFormPage } from './contrato-form.page';

@NgModule({
  declarations: [
    ContratoFormPage,
  ],
  imports: [
    SharedModule,
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  providers: [
    // FilterPipe
  ]
})

export class ContratoFormPageModule { }
