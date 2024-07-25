import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoUsuarioService } from 'src/app/providers/contrato-usuario.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'

import { SocketService } from 'src/app/providers/socket.service'
import { ContratoUsuarioPageService } from '../interno/contrato-usuario/contrato-usuario-page.service'

@Component({
  selector: 'app-convite-page',
  templateUrl: './convite.page.html',
  styleUrls: ['./convite.page.scss']
})
export class ConvitePage extends ListPage {

  contratoUsuarios: any[] | undefined

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    protected authService: AuthService,
    public appUtil: AppUtil,
    protected platform: Platform,
    protected route: ActivatedRoute,
    protected element: ElementRef,
    protected messageService: MessageService,
    protected storageService: StorageService,
    private contratoUsuarioService: ContratoUsuarioService,
    private contratoUsuarioPageService: ContratoUsuarioPageService,
    private contratoService: ContratoService,
    protected loadingCtrl: LoadingController,
    protected socketService: SocketService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, contratoUsuarioService, contratoUsuarioPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Convite', 'contratoUsuarios', 'contratoUsuario')

  }

  async load(hiddenLoad = false) {

    await this.beforeLoad()

    this.loadDefault([
      this.contratoUsuarioService.getConvites()
    ], hiddenLoad)

  }

  async seleciona(registro?: any) {
    throw new Error('Method not implemented.')
  }
  async form(registro?: any) {
    throw new Error('Method not implemented.')
  }

  async aceitar(contratoUsuario: any) {

    if (contratoUsuario.aceite) {
      let url = this.router.url.split('/')
      url[1] = 'painel'
      url[2] = contratoUsuario.contratoId
      url[3] = 'home'
      url.splice(4)
      location.pathname = url.join('/')
      await this.dismiss()
      this.modalCtrl.getTop().then(top => top?.dismiss())
      return
    }

    const loading = await this.loadingCtrl.create({ message: 'Carregando...' })
    loading.present()

    this.contratoUsuarioService.aceitar(contratoUsuario.id)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: data => {

          this.appUtil.toast('Parabéns! Agora você pode acessar este ambiente.', 3000, 'success')
          contratoUsuario.aceite = true

          this.authService.auth().subscribe(() => {

            if (this.contratoUsuarios?.length === 1) this.aceitar(contratoUsuario)

            // this.contratoUsuarioService.entityUpdated.next(data.contratoUsuario)
            this.contratoService.setState.next({ registros: this.contratoUsuarios?.filter(cu => cu.aceite).map(cu => cu.contrato) })
            this.contratoService.entityUpdated.next(data) // este aqui precisa? // só serve para master

          })
        },
        error: err => this.appUtil.alertError(err),
      })

  }

}
