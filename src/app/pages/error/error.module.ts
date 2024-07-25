import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { ErrorPage } from './error.page'

@NgModule({
  declarations: [
    ErrorPage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [

  ]
})

export class ErrorPageModule { }
