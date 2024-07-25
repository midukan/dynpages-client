import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core'
import { LoadingController, NavController } from '@ionic/angular'
import { Subscription, finalize } from 'rxjs'
import { AppUtil } from 'src/app/app-util'
import { ConvitePageService } from 'src/app/pages/convite/convite-page.service'
import { UsuarioDevicePageService } from 'src/app/pages/interno/usuario-device/usuario-device-page.service'
import { UsuarioPageService } from 'src/app/pages/usuario/usuario-page.service'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  environment = environment

  usuarioLogado: any

  nomePop: any

  taskbarId: string
  taskbarItemId: number

  subscriptions: Subscription[] = []

  @Input() appTitle: string
  @Input() appSubtitle: string
  @Input() appType: 'page' | 'modal'
  @Input() fullContent = false
  @Input() minimizable = true
  @Input() maximizable = true
  @Input() startMaximized = false
  @Input() show: {
    confirm?: boolean,
    dismiss?: boolean,
  } = {}

  @Output() appDismiss: EventEmitter<any> = new EventEmitter
  @Output() appConfirm: EventEmitter<any> = new EventEmitter

  constructor(
    private element: ElementRef,
    public authService: AuthService,
    private navCtrl: NavController,
    private messageService: MessageService,
    private usuarioPageService: UsuarioPageService,
    private convitePageService: ConvitePageService,
    private usuarioDevicePageService: UsuarioDevicePageService,
    protected loadingCtrl: LoadingController,
    private appUtil: AppUtil,
  ) {

    this.usuarioLogado = this.authService.getAuth()

    this.nomePop = 'popUsuario' + Math.random()

    this.subscriptions.push(this.messageService.get<HeaderComponent>('modal.show').subscribe(data => {

      if (data.taskbarItemId === this.taskbarItemId) {

        const ionModal = this.getParents().ionModal

        ionModal.style.display = 'flex'
        setTimeout(() => {
          ionModal.style.opacity = '1'
        })

        this.messageService.get('modal.resize').next(null)

      }

    }))

  }

  async ngOnInit() {

    if (this.appType === 'modal') {

      if (this.usuarioLogado.modalMaximized || this.startMaximized) {
        setTimeout(() => {
          this.maximize()
        })
      }

      if (this.minimizable) {

        this.taskbarId = location.pathname

        this.taskbarItemId = Math.random()

        this.messageService.get('modal.create.minizable').next(this)

      }

      this.messageService.get('modal.create').next(this)

    }

  }

  ngOnDestroy() {

    this.messageService.get<HeaderComponent>('modal.destroy').next(this)

    this.subscriptions.forEach(s => s.unsubscribe())

  }

  async logout() {

    await this.authService.logout()
    this.navCtrl.navigateRoot(environment.paths.noAuthUrl)

  }

  async reenviarEmail() {

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' })
    loading.present()

    this.authService.reenviarEmailValidacao()
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: data => {

          this.appUtil.toast('Email de confirmação enviado. Verifique sua caixa de email.', 5000, 'success')

        },
        error: err => this.appUtil.alertError(err)
      })

  }

  async minhaConta() {

    const modal = await this.usuarioPageService.modalForm([], this.usuarioLogado)

  }

  async minhaSenha() {

    const modal = await this.usuarioPageService.modalForm([], this.usuarioLogado, 'senha')

  }

  async seguranca() {

    const modal = await this.usuarioPageService.modalForm([], this.usuarioLogado, 'seguranca')

  }

  async configuracoes() {

    const modal = await this.usuarioPageService.modalForm([], this.usuarioLogado, 'config')

  }

  async meusConvites() {

    const modal = await this.convitePageService.modalSelectFull()

  }

  async meusDispositivos() {

    const modal = await this.usuarioDevicePageService.modalList()

  }

  minimize() {

    const ionModal = this.getParents().ionModal

    if (ionModal.style.display === 'none') return

    ionModal.style.transition = 'opacity 0.3s'
    ionModal.style.opacity = '0'

    setTimeout(() => {
      ionModal.style.display = 'none'
      this.messageService.get('modal.minimize').next(this)
    }, 300)

  }

  maximize() {

    if (!this.maximizable) {
      return
    }

    const ionModalContent = this.element.nativeElement
    const ionPage = ionModalContent.parentElement
    let ionModalHeader: HTMLElement = ionPage.querySelector('ion-header')

    const eventoDuploClique = new MouseEvent('dblclick', { bubbles: false, cancelable: true });
    ionModalHeader.dispatchEvent(eventoDuploClique);

  }

  private getParents() {

    const ionModalContent = this.element.nativeElement
    const ionPage = ionModalContent.parentElement
    const ionModal = ionPage?.parentElement

    return { ionModalContent, ionPage, ionModal }

  }

  confirm() {

    this.appConfirm.next(null)

  }

  dismiss() {

    this.appDismiss.next(null)

  }

}
