import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoUsuarioService } from 'src/app/providers/contrato-usuario.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'

import { SocketService } from 'src/app/providers/socket.service'
import { ContratoUsuarioPageService } from '../contrato-usuario-page.service'

@Component({
  selector: 'app-contrato-usuario-list-page',
  templateUrl: './contrato-usuario-list.page.html',
  styleUrls: ['./contrato-usuario-list.page.scss']
})
export class ContratoUsuarioListPage extends ListPage {

  contratoUsuarios: any
  contratoUsuariosTotal: any

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    protected route: ActivatedRoute,
    protected messageService: MessageService,
    protected authService: AuthService,
    protected appUtil: AppUtil,
    public platform: Platform,
    protected storageService: StorageService,
    protected loadingCtrl: LoadingController,
    private contratoUsuarioService: ContratoUsuarioService,
    protected element: ElementRef,
    private contratoUsuarioPageService: ContratoUsuarioPageService,
    protected socketService: SocketService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, contratoUsuarioService, contratoUsuarioPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault("Cargos e acessos", 'contratoUsuarios', 'contratoUsuario')

  }

  async seleciona(contratoUsuario?: any) {

    if (this.bulkSelect) {
      contratoUsuario.selected = !contratoUsuario.selected
      return
    }

    this.form(contratoUsuario)

  }

  async form(contratoUsuario?: any) {

    const modal = await this.contratoUsuarioPageService.modalForm(this.filtersSelectDatas, contratoUsuario, this.filters.contratoId[0])

    modal.onDidDismiss().then((data) => {
      this.autoSelecionaData(data, this.keyEntity);
    });

  }

  async showBulkSelect() {

    this.bulkSelect = !this.bulkSelect

  }

  pagerChange() {

    this.load()

  }

}
