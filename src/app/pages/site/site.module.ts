import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'

import { HomePageModule } from './home/home.module'
import { PoliticaTermosModule } from './politica-termos/politica-termos.module'
import { SiteRoutingModule } from './site-routing.module'
import { SitePage } from './site.page'

@NgModule({
  declarations: [
    SitePage,
  ],
  imports: [
    HomePageModule,
    PoliticaTermosModule,
    SharedModule,
    SiteRoutingModule,
  ],
  providers: [
    // FilterPipe
  ]
})

export class SitePageModule { }
