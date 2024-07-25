import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { HomePage } from './home.page'

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    SharedModule,
  ],
  providers: [

  ]
})

export class HomePageModule { }
