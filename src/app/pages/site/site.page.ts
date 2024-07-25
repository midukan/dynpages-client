import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalController, Platform } from '@ionic/angular'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'

@Component({
  selector: 'app-site-page',
  templateUrl: './site.page.html',
  styleUrls: ['./site.page.scss']
})
export class SitePage extends BasePage {

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    protected authService: AuthService,
    public appUtil: AppUtil,
    protected platform: Platform,
    protected route: ActivatedRoute,
    protected messageService: MessageService,
    protected element: ElementRef,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

  }

}
