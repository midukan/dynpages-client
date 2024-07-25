import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonContent, ModalController } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'

@Component({
  selector: 'app-error-page',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss']
})
export class ErrorPage extends BasePage implements OnInit {

  headerShowBg = false

  tipo: 'CUSTOM' | 'NOT_FOUND' | 'CONVITE_PAGE' = 'CUSTOM'

  title: string
  msg: string
  url = location.pathname + '' + location.search

  ionScrollSub: Subscription

  @ViewChild(IonContent, { static: false }) content: IonContent

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    public appUtil: AppUtil,
    protected route: ActivatedRoute,
    public authService: AuthService,
    protected element: ElementRef,
    private messageService: MessageService,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

    this.title = this.state.title || 'Ops!'
    this.msg = this.state.message || 'Verifique sua conexão com a internet. Se o erro permanecer, entre em contato conosco.'

    this.route.data.subscribe(data => {
      this.tipo = data.tipo || this.state.tipo || this.tipo
    })

  }

  async ngOnInit() {

    await this.ngOnInitDefault()

    if (this.queryParams.tipo) {
      this.tipo = this.queryParams.tipo
    }

    if (this.tipo === 'CONVITE_PAGE') {
      this.url = '/convite'
    }

    this.ionScrollSub = this.content.ionScroll.subscribe(data => this.headerShowBg = !!data.detail.scrollTop)

  }

  async ngOnDestroy() {

    await this.ngOnDestroyDefault()

    this.ionScrollSub.unsubscribe()

  }

  async modalContrato() {

		this.messageService.get('contrato.modal.open').next(null)

	}

}
