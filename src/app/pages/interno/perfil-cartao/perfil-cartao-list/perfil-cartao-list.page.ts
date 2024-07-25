import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { PerfilCartaoService } from 'src/app/providers/perfil-cartao.service'
import { StorageService } from 'src/app/providers/storage.service'

import { ContratoService } from 'src/app/providers/contrato.service'
import { SocketService } from 'src/app/providers/socket.service'
import { PerfilCartaoPageService } from '../perfil-cartao-page.service'


@Component({
  selector: 'app-perfil-cartao-list',
  templateUrl: './perfil-cartao-list.page.html',
  styleUrls: ['./perfil-cartao-list.page.scss'],
})
export class PerfilCartaoListPage extends ListPage {

  perfilCartoes: any
  perfilCartoesTotal: any

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
    protected socketService: SocketService,
    private perfilCartaoService: PerfilCartaoService,
    private perfilCartaoPageService: PerfilCartaoPageService,
    protected element: ElementRef,
    private contratoService: ContratoService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, perfilCartaoService, perfilCartaoPageService)

    this.perfilCartaoService.entityUpdated.subscribe(data => {

      // Ativa uma série de eventos que faz com que o getContrato() atualize, bem como os cartões
      this.contratoService.entityUpdated.next(null)

    })

  }

  async ngOnInit(): Promise<void> {

    await this.ngOnInitDefault('Cartões', 'perfilCartoes', 'perfilCartao')

  }

  // verificar uso
  async seleciona(registro?: any) {

    await this.selecionaDefault(registro, entity => {
      return entity.apelido + ' - final ' + entity.final
    })

  }

  async formDefault(registro?: any) {

    const modal = await this.pageService?.modalForm(this.filtersSelectDatas, registro, this.filters.perfilId[0]);

    // modal pode não existir se o seleciona usa somente para selecionar nos selects
    modal?.onDidDismiss().then((data) => {
      this.autoSelecionaData(data, this.keyEntity);
    })

  }

}
