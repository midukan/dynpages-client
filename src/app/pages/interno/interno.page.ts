import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular'
import { firstValueFrom, Subscription } from 'rxjs'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { MessageService } from 'src/app/providers/message.service'
import { SocketService } from 'src/app/providers/socket.service'
import { UsuarioService } from 'src/app/providers/usuario.service'

import { ContatoPageService } from '../contato/contato-page.service'
import { UsuarioPageService } from '../usuario/usuario-page.service'
import { ContratoPageService } from './contrato/contrato-page.service'
import { internoMenuData, MenuItem } from './interno-menu.data'
import { PerfilPageService } from './perfil/perfil-page.service'

@Component({
  selector: 'app-interno-page',
  templateUrl: './interno.page.html',
  styleUrls: ['./interno.page.scss'],
})
export class InternoPage extends BasePage {

  statistics: any = {}

  contrato: any
  contratoId: any

  contratos: any[]

  bloqueioSemAssinatura = false

  submenuShow = 0
  menuTemplateShowId: string | undefined
  menuTemplateShow: any

  socketSub: Subscription
  // verificaAssinaturaSub: Subscription
  updateContratosSub: Subscription

  @ViewChildren('menuChildrenRef') menuChildren: QueryList<any>

  menu: MenuItem[] = []

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    public authService: AuthService,
    public appUtil: AppUtil,
    protected platform: Platform,
    protected route: ActivatedRoute,
    protected messageService: MessageService,
    private socketService: SocketService,
    private navCtrl: NavController,
    private perfilPageService: PerfilPageService,
    private contratoPageService: ContratoPageService,
    private contratoService: ContratoService,
    protected loadingCtrl: LoadingController,
    protected element: ElementRef,
    private usuarioPageService: UsuarioPageService,
    private usuarioService: UsuarioService,
    public contatoPageService: ContatoPageService, // usado no interno-menu.data
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

    this.socketSub = this.socketService.getMsg(this.env.enums.IdDataSocket.ADMIN_STATS).subscribe((data) => {
      this.statistics = data.statistics
      this.statistics.usuarios.forEach(usuario => {
        if (!usuario._currentUrl) {
          usuario._currentUrlDecoded = ''
          usuario._currentUrlDecodedQP = {}
        }
        usuario._currentUrlDecoded = usuario._currentUrl?.split('?filters=')[0]
        usuario._currentUrlDecodedQP = usuario._currentUrl?.split('?filters=')[1] ? ({ filters: decodeURIComponent(usuario._currentUrl?.split('?filters=')[1]) }) : {}
      })
    })

    // this.verificaAssinaturaSub = this.messageService.get('verifica.assinatura').subscribe((data) => {
    // 	this.verificaAssinatura()
    // })

    this.updateContratosSub = this.contratoService.entityUpdated.subscribe((data) => {
      this.ngOnInit()
    })

  }

  async ngOnInit() {

    await this.ngOnInitDefault()

    const valEmailAction = this.router.url.split('/')[2]?.split('?')[0]

    if (valEmailAction === 'valida-email' && this.queryParams.code) {

      const loading = await this.loadingCtrl.create({ message: 'Validando...' })
      loading.present()

      const result = await firstValueFrom(this.authService.validaEmail(this.queryParams.code))
        .catch(err => this.appUtil.alertError(err))

      loading.dismiss()

      if (result) {
        this.authService.auth().subscribe()
        // this.appUtil.toast('Email validado com sucesso.', 2000, 'success')
        this.appUtil.alertMessage('Email validado com sucesso.')
      }

    }

    this.contratos = this.authService.getContratos()
    this.contrato = this.authService.getContrato()
    this.contratoId = this.contrato?.id

    if (!this.contrato.id) {
      const usuarioLogado = this.authService.getAuth()
      this.contratoPageService.posAuthAction(usuarioLogado)
      return
    }

    this.env.paths.isAuthUrlAdmin = '/painel/' + this.contratoId + ''

    this.updateContrato() // descomentado, mas precisa ver se está certo

    // this.verificaAssinatura()

    this.buildMenu()

    this.autoSelecionaSubmenu()

    this.darkModeSet()

    this.messageService.get('contrato.modal.open').subscribe(() => {
      this.modalContrato()
    })

    this.usuarioService.entityUpdated.subscribe(() => {
      this.darkModeSet()
    })

  }

  ionViewDidEnter() {

    this.ionViewDidEnterDefault()

  }

  ngOnDestroy() {

    this.socketSub.unsubscribe()
    // this.verificaAssinaturaSub.unsubscribe()
    this.updateContratosSub.unsubscribe()

    this.ngOnDestroyDefault()

  }

  darkModeSet() {

    const classList = document.getElementsByTagName('html')[0].classList

    let add = false

    if (this.usuarioLogado.darkMode === this.env.enums.UsuarioDarkMode.AUTO) {
      add = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else if (this.usuarioLogado.darkMode === this.env.enums.UsuarioDarkMode.DARK) {
      add = true
    } else if (this.usuarioLogado.darkMode === this.env.enums.UsuarioDarkMode.LIGHT) {
      add = false
    }

    if (add && !classList.contains('dark-mode')) {
      classList.add('dark-mode')
    } else if (!add && classList.contains('dark-mode')) {
      classList.remove('dark-mode')
    }

  }

  buildMenu() {

    this.menu = internoMenuData(this)

    this.menu.forEach(m => {
      (m.children || []).forEach(m2 => {
        (m2.children || []).forEach(m3 => {
          if (m3.show) {
            m2.show = true
            m.show = true
          }
        })
      })
    })

  }

  autoSelecionaSubmenu() {

    setTimeout(() => {

      const menu = internoMenuData(this)

      menu.forEach(m => {
        m.children?.forEach(c => {
          c.children?.forEach(c2 => {
            if (this.router.url.includes(c2.routerLink!)) {
              this.openSubmenu(c.id!)
            }
          })
        })
      })

    })

  }

  openSubmenu(menuId: string) {

    const submenuTpl = this.menuChildren.toArray().find(m => m.elementRef.nativeElement.previousElementSibling.id === menuId)

    if (this.submenuShow) {

      this.submenuShow = 1

      setTimeout(() => {

        this.menuTemplateShowId = menuId
        this.menuTemplateShow = submenuTpl
        setTimeout(() => {
          this.submenuShow = 2
        }, 50)

      }, 150)

    } else {

      this.menuTemplateShowId = menuId
      this.menuTemplateShow = submenuTpl
      this.submenuShow = 2

    }

  }

  closeSubmenu() {

    this.submenuShow = 0

    setTimeout(() => {

      this.menuTemplateShowId = undefined
      this.menuTemplateShow = undefined

    }, 300)

  }

  updateContrato() {

    const splitUrl = location.pathname.split('/')
    const urlContratoId = +splitUrl[2]

    const regex = /({"contratoId":\[)(\d+)(\]})/;
    let search = decodeURIComponent(location.search).replace(regex, '$1' + this.contratoId + '$3');

    if (splitUrl[3] !== 'contrato-usuario') {
      search = ''
    }

    // console.log(urlContratoId, this.contratoId)

    if (urlContratoId !== this.contratoId) {

      splitUrl[2] = this.contratoId + ''

      if (!this.usuarioLogado.isMasterAdmin) {
        splitUrl[3] = 'home'
        if (splitUrl[5]) splitUrl.pop()
        if (splitUrl[4]) splitUrl.pop()
      }

      this.navCtrl.navigateRoot(splitUrl.join('/') + search)

    }

  }

  async modalContrato() {

    const modal = await this.contratoPageService.modalForm()

    modal.onDidDismiss().then(async (data) => {
      if (data.data?.contrato) {
        const loading = await this.loadingCtrl.create({ message: 'Aguarde...' })
        await firstValueFrom(this.authService.auth())
        loading.dismiss()
        this.ngOnInit()
        this.contratoId = data.data.contrato.id
        this.updateContrato()
      }
    })

  }

  async modalUsuario(usuario: any) {

    this.usuarioPageService.modalForm([], usuario)

  }

}
