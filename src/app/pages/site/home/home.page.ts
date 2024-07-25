import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonButton, IonContent, ModalController, Platform } from '@ionic/angular'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { DataService } from 'src/app/providers/data.service'
import { MessageService } from 'src/app/providers/message.service'
import { ContatoPageService } from '../../contato/contato-page.service'
import { PoliticaTermosPageService } from '../politica-termos/politica-termos-page.service'

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage extends BasePage {

  exclusivoSelecionado: any

  @ViewChild(IonContent) content: IonContent
  @ViewChild('buttonScrollToTop') buttonScrollToTop: IonButton

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    public authService: AuthService,
    public appUtil: AppUtil,
    protected platform: Platform,
    protected route: ActivatedRoute,
    protected element: ElementRef,
    public politicaTermosPageService: PoliticaTermosPageService,
    public contatoPageService: ContatoPageService,
    private dataService: DataService,
    private messageService: MessageService,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

  }

  async ngOnInit() {

    document.getElementsByTagName('html')[0].classList.remove('dark-mode')

    if (this.testeAndRedirIfPWA()) return

    await this.ngOnInitDefault();

    this.messageService.get('site.scrollToBlock').subscribe(elemId => {
      this.scrollToBlock(elemId as string)
    })

    setTimeout(() => {
      (window as any).prerenderReady = true
    }, 2000) // Por garantia

    this.content.scrollEvents = true
    this.content.ionScroll.subscribe(event => {

      const topLimit = document.getElementById('planos')!.offsetTop;
      (this.buttonScrollToTop as any).el.classList[(event.detail.scrollTop > topLimit) ? 'remove' : 'add']('display-none')

    })

  }

  async ionViewWillEnter() {

    if (this.testeAndRedirIfPWA()) return

    await this.ionViewDidEnterDefault()

  }

  private testeAndRedirIfPWA() {

    if (this.platform.is('pwa') && !navigator.userAgent.toLowerCase().includes('prerender') && !location.hash.includes('#')) {
      this.router.navigateByUrl('/painel')
      return true
    }

    return false

  }

  scrollToBlock(elemId: string) {

    // topo, funcoes, exclusivas, plataformas, ia, suporte, planos, representante, faq, rodape

    const elem = document.getElementById(elemId)

    this.content.scrollToPoint(0, elem!.offsetTop, 1000)

  }

  selecionaPlano(planoNum: number, planoPeriodo = 'MENSAL', acao: 'periodo' | 'plano' = 'plano') {

    if (acao === 'periodo') return

    // const plano = 'PLANO_' + planoNum // 0 ao 3
    this.dataService.set('plano.selected', planoNum)
    this.dataService.set('planoPeriodo.selected', planoPeriodo)

    if (this.authService.isAuth()) {
      this.dataService.set('pathnameRedir', '/painel/0/plano')
      this.router.navigateByUrl(this.env.paths.isAuthUrlAdmin)
    } else {
      this.router.navigateByUrl('/criar-conta')
    }

  }

}
