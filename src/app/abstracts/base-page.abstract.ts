import { Component, ElementRef, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalController } from '@ionic/angular'
import { Subject, Subscription } from 'rxjs'
import { environment } from 'src/environments/environment'

import { AppUtil } from '../app-util'
import { AuthService } from '../providers/auth.service'

@Component({
  template: ''
})
export abstract class BasePage {

  env = environment

  @Input() state: any

  routeData: any
  params: any
  queryParams: any

  isModal = true
  modalId: string

  headerType: 'modal' | 'page'
  title: string
  subtitle: string
  private revertTitle: string

  usuarioLogado: any

  routDataSub: Subscription
  routParamsSub: Subscription
  routQueryParamsSub: Subscription

  customSubscriptions: (Subscription | Subject<any>)[] = []

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected modalCtrl: ModalController,
    protected authService: AuthService,
    protected appUtil: AppUtil,
    protected element: ElementRef,
  ) {

    const navig = this.router.getCurrentNavigation()
    this.setState(navig?.extras?.state || this.state || {})

    this.usuarioLogado = this.authService.getAuth()

  }

  get log() {
    return console.log
  }

  async ngOnInit() {

    await this.ngOnInitDefault()

  }

  async ngOnInitDefault(): Promise<void> {

    this.isModal = this.getParents().ionModal.nodeName === 'ION-MODAL'

    this.routeData = await new Promise(r => this.routDataSub = this.route.data.subscribe(p => {
      r(p)
    }))

    this.params = await new Promise(r => this.routParamsSub = this.route.params.subscribe(p => {
      r(p)
    }))

    this.queryParams = await new Promise(r => this.routQueryParamsSub = this.route.queryParams.subscribe(p => {
      r(p)
    }))

    this.headerType = this.isModal ? 'modal' : 'page'

  }

  ionViewDidEnter() {
    this.ionViewDidEnterDefault()
  }

  async ionViewDidEnterDefault() {

    this.setTitle(this.title, this.subtitle) // usado para atualizar o title do document

    const modal = await this.modalCtrl.getTop()

    if (this.isModal && modal?.id && !this.modalId) {
      this.modalId = modal?.id
    }

  }

  ngOnDestroy() {

    this.ngOnDestroyDefault()

  }

  ngOnDestroyDefault() {

    if (this.isModal) {
      this.setTitle(this.revertTitle)
      this.revertTitle = ''
    }

    this.routDataSub?.unsubscribe()
    this.routParamsSub?.unsubscribe()
    this.routQueryParamsSub?.unsubscribe()

    this.customSubscriptions.forEach(sub => {
      sub.unsubscribe()
    })

  }

  setState(state: any) {
    this.state = state
  }

  setTitle(title?: string, subtitle?: string) {

    if (title) {

      this.title = title

      if (!title.includes('Ops!')) {
        if (this.isModal && !this.revertTitle) {
          this.revertTitle = document.title.replace(' - ' + this.env.infos.appName, '')
        }
        document.title = title + (window.matchMedia('(display-mode: standalone)').matches ? '' : ' - ' + this.env.infos.appName)
      }

    }

    if (subtitle) {
      this.subtitle = subtitle
    }

  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data, !data ? 'close' : undefined, this.modalId)
  }

  getParents() {

    const ionPage = this.element.nativeElement
    const ionModal = ionPage?.parentElement

    return { ionPage, ionModal }

  }

}
