import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController } from '@ionic/angular'
import html2canvas from 'html2canvas'
import * as printJS from 'print-js'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-page-politica-termos',
  templateUrl: 'politica-termos.html',
  styleUrls: ['politica-termos.scss']
})
export class PoliticaTermosPage extends BasePage {

  environment = environment

  isModal = false

  tela: 'politica' | 'termos' = 'termos';

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    public authService: AuthService,
    public appUtil: AppUtil,
    protected route: ActivatedRoute,
    protected element: ElementRef,
    private loadingCtrl: LoadingController,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

  }

  async ngOnInit() {

    await this.ngOnInitDefault()

    const param = location.pathname.split('/')[1];

    if (param === 'politica-de-privacidade') {
      this.tela = 'politica';
    } else if (param === 'termos-de-uso') {
      this.tela = 'termos';
    }

    if (this.tela === 'politica') {
      this.title = 'Política de privacidade'
      this.subtitle = 'Leia com a devida atenção.'
    } else if (this.tela === 'termos') {
      this.title = 'Termos de uso'
      this.subtitle = 'Leia com a devida atenção.'
    }

    this.headerType = 'modal'

  }

  async ionViewDidEnter() {

    this.isModal = !!(await this.modalCtrl.getTop())

  }

  async dismiss() {

    const modal = await this.modalCtrl.getTop()

    if (!modal) {
      this.router.navigateByUrl(environment.paths.isAuthUrl)
      return
    }

    modal.dismiss()

  }

  async print(event: any) {

    if (!event) return

    const loading = await this.loadingCtrl.create({ message: 'Gerando...' })
    await loading.present()

    let element = event.srcElement

    let limit = 15

    while (1) {

      if (!element?.parentElement) {
        break
      }

      element = element.parentElement

      if (element.classList.contains('form-default') || element.classList.contains('printable-content')) {
        break
      }

      if (!--limit) {
        console.error('Falha ao localizar .form-default.')
        element = null
        loading.dismiss()
        break
      }

    }

    if (element) {

      let blockToPrint = element.querySelectorAll('.form-default-body, .printable-content-body')
      blockToPrint = blockToPrint[blockToPrint.length - 1]

      if (window.innerWidth <= (window as any).GLOBAL_MOBILE_WIDTH) blockToPrint.style.width = '1330px'

      const isDarkMode = document.getElementsByTagName('html')[0].classList.contains('dark-mode')
      if (isDarkMode) document.getElementsByTagName('html')[0].classList.toggle('dark-mode')

      setTimeout(async () => {
        const canvas = await html2canvas(blockToPrint);
        if (isDarkMode) document.getElementsByTagName('html')[0].classList.toggle('dark-mode')
        blockToPrint.style.width = null
        await printJS({
          printable: canvas.toDataURL('image/png'),
          type: 'image',
          documentTitle: 'DynPages - ' + this.title
        })
        loading.dismiss()
      }, 1000)

    } else {
      loading.dismiss()
    }

  }

}
