import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'
import { UsuarioService } from 'src/app/providers/usuario.service'

import { firstValueFrom } from 'rxjs'
import { ContratoUsuarioService } from 'src/app/providers/contrato-usuario.service'
import { SocketService } from 'src/app/providers/socket.service'
import { ContratoUsuarioPageService } from '../../interno/contrato-usuario/contrato-usuario-page.service'
import { UsuarioPageService } from '../usuario-page.service'

@Component({
  selector: 'app-usuario-list-page',
  templateUrl: './usuario-list.page.html',
  styleUrls: ['./usuario-list.page.scss']
})
export class UsuarioListPage extends ListPage {

  usuarios: any
  usuariosTotal: any

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    public storageService: StorageService,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    protected messageService: MessageService,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    private usuarioService: UsuarioService,
    protected element: ElementRef,
    private usuarioPageService: UsuarioPageService,
    protected socketService: SocketService,
    private contratoUsuarioService: ContratoUsuarioService,
    private contratoUsuarioPageService: ContratoUsuarioPageService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, usuarioService, usuarioPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Usuários', 'usuarios', 'usuario')

  }

  async afterLoad(): Promise<void> {

    await this.afterLoadDefault()

    this.usuarios.forEach(usuario => {
      usuario.cargo = usuario.contratoUsuarios.filter(cu => cu.contratoId === this.authService.getContrato().id).pop()?.cargo
    })

  }

  async cargo(usuario: any) {

    const loading = await this.loadingCtrl.create({ message: 'Carregando...' })
    loading.present()

    const data = await firstValueFrom(this.contratoUsuarioService.getMany({
      usuarioId: [usuario.id],
      contratoId: [this.authService.getContrato().id],
      pager: { limit: 1 }
    }))
      .finally(() => loading.dismiss())
      .catch(err => this.appUtil.alertError('Registro de acesso não encontrado.'))

    if (!data?.contratoUsuarios?.length) {
      this.appUtil.alertError('Registro de acesso não encontrado.')
      return
    }

    const contratoUsuario = data.contratoUsuarios.pop()

    this.contratoUsuarioPageService.modalForm([], contratoUsuario, undefined, true)

  }

}
