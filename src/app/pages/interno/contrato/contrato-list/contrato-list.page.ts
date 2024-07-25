import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { ConvitePageService } from 'src/app/pages/convite/convite-page.service'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoUsuarioService } from 'src/app/providers/contrato-usuario.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'

import { DataService } from 'src/app/providers/data.service'
import { SocketService } from 'src/app/providers/socket.service'
import { ContratoUsuarioPageService } from '../../contrato-usuario/contrato-usuario-page.service'
import { ContratoPageService } from '../contrato-page.service'

@Component({
  selector: 'app-contrato-list-page',
  templateUrl: './contrato-list.page.html',
  styleUrls: ['./contrato-list.page.scss']
})
export class ContratoListPage extends ListPage {

  contratos: any
  contratosTotal: any

  forceSelect = false

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    private navCtrl: NavController,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    protected messageService: MessageService,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    private contratoService: ContratoService,
    protected storageService: StorageService,
    protected element: ElementRef,
    private convitePageService: ConvitePageService,
    private contratoUsuarioPageService: ContratoUsuarioPageService,
    private contratoPageService: ContratoPageService,
    private contratoUsuarioService: ContratoUsuarioService,
    protected socketService: SocketService,
    private dataService: DataService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, contratoService, contratoPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Empresas', 'contratos', 'contrato')

    this.subtitle = this.subtitle.replace('registro', 'ambiente')

    // Modo antigo de cadastrar contrato
    // if (!this.contratos.length && this.dataService.get('plano.selected')) {
    //   this.form()
    // }

  }

  async form(contrato?: any) {

    const modal = await this.contratoPageService.modalForm(this.filtersSelectDatas, contrato);

    modal.onDidDismiss().then(data => {

      if (data?.data && !data.role) {
        this.authService.auth().subscribe()
      }

      this.autoSelecionaData(data, this.keyEntity)

    })

  }

  async modalConvite() {

    const modal = await this.convitePageService.modalSelectFull()

  }

  async listContratoUsuario(contrato?: any) {

    this.contratoUsuarioPageService.modalList({ contratoId: [contrato.id] })

  }

  async sairDoContrato(contrato?: any) {

    this.appUtil.alertMessage('Você perderá acesso a este ambinete e será necessário um novo convite para adentrar novamente.', {}, async () => {

      const contratoUsuario = this.authService.getContratoUsuarios().find(cu => cu.contratoId === contrato.id)

      if (!contratoUsuario) {
        return
      }

      const loading = await this.loadingCtrl.create({ message: 'Carregando...' })
      loading.present()

      this.contratoUsuarioService.delete(contratoUsuario)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe({
          next: async data => {

            if (this.authService.getContrato().id === contrato.id) {
              location.reload()
            } else {
              this.contratoService.entityUpdated.next(data.contrato)
            }

          },
          error: err => this.appUtil.alertError(err)
        })

    }, () => { })

  }

  async excluirSelecionados() {

    const contratos = this.contratos.filter(p => p.selected)

    const loading = await this.loadingCtrl.create({ message: 'Excluindo...' })
    loading.present()

    this.contratoService.delete(contratos)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: async data => {

          if (contratos.map(c => c.id).includes(this.authService.getContrato().id)) {

            await this.authService.logout(true)
            this.navCtrl.navigateRoot(this.env.paths.noAuthUrl)

          } else {

            this.authService.auth().subscribe()
            this.contratoService.entityUpdated.next(null)
            // this.showBulkSelect('contratos')

          }

        },
        error: err => this.appUtil.pageRequestError(err, 'alert')
      })

  }

  getPlanoValor(contrato: any) {

    const valor = this.env.planos[contrato.planoOpcao + '_VALOR_' + contrato.planoPeriodo] || 0
    const desconto = (100 - contrato.planoDesconto) / 100

    return valor * desconto

  }

  async logout() {

    await this.authService.logout(true)
    this.navCtrl.navigateRoot(this.env.paths.noAuthUrl)

    this.modalCtrl.dismiss()

  }

}
