import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonInput, LoadingController, ModalController, NavController, Platform } from '@ionic/angular'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { MiscService } from 'src/app/providers/misc.service'
import { PerfilService } from 'src/app/providers/perfil.service'
import { SocketService } from 'src/app/providers/socket.service'
import { environment } from 'src/environments/environment'
import { PerfilPageService } from '../perfil-page.service'

@Component({
  selector: 'app-perfil-form-page',
  templateUrl: './perfil-form.page.html',
  styleUrls: ['./perfil-form.page.scss']
})
export class PerfilFormPage extends FormPage {

  perfilDefault: any = {
    nome: '',
    tipo: environment.enums.PerfilTipo.CLIENTE,
    pessoa: environment.enums.PerfilPessoa.PJ,
    optanteSN: true,
    indicadorInsEst: null,
    ativo: true,
    perfilContatos: [],
  }
  perfil: any

  tipos = Object.entries(environment.enums.PerfilTipoStr).map(pt => ({ label: environment.enums.PerfilTipoStr[pt[0]], value: pt[0] }))
  pessoas = Object.entries(environment.enums.PerfilPessoaStr).map(pt => ({ label: environment.enums.PerfilPessoaStr[pt[0]], value: pt[0] }))
  perfilIndicadorInsEsts = Object.entries(environment.enums.PerfilIndicadorInsEstStr).map(pt => ({ label: environment.enums.PerfilIndicadorInsEstStr[pt[0]], value: pt[0] }))
  perfilContatoCargos = Object.entries(environment.enums.PerfilContatoCargoStr).map(pt => ({ label: environment.enums.PerfilContatoCargoStr[pt[0]], value: pt[0] }))

  @ViewChildren(IonInput) ionInputs: QueryList<IonInput>

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    public messageService: MessageService,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    private perfilService: PerfilService,
    private miscService: MiscService,
    protected element: ElementRef,
    protected perfilPageService: PerfilPageService,
    protected socketService: SocketService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, perfilService, perfilPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Perfil', 'perfil')

    this.setTitle(this.env.enums.PerfilTipoStr[this.perfil?.tipo])

    this.perfil.tabelaPrecoSelectData = { text: this.perfil.tabelaPreco?.nome || 'Selecione', id: this.perfil.tabelaPrecoId }

    this.perfil._estadoId = this.perfil.enderecoCidade?.estadoId
    this.setEnderecoCidadeSelectData()

    // Foi adicionado no initDefault
    // if (this.state.perfilTipo) {
    //   this.perfil.tipo = this.state.perfilTipo
    // }

  }

  setFiltersSelectData() {

    // this.projeto.cliente = { id: this.filtersSelectDatas.clienteId?.id, nome: this.filtersSelectDatas.clienteId?.text }
    // this.projeto.clienteId = this.filtersSelectDatas.clienteId?.id

  }

  novoContato() {

    const contato = this.appUtil.deepCopy({})
    this.perfil.perfilContatos.push(contato)

  }

  removeContato(contato?: any) {

    const idx = this.perfil.perfilContatos.findIndex(c => c === contato)

    if (!contato.id) {
      this.perfil.perfilContatos.splice(idx, 1)
    } else {
      contato.delete = !contato.delete
    }

  }

  limparDadosPJPF() {

    // dados
    this.perfil.documento = ''

    // fiscal
    this.perfil.optanteSN = false
    this.perfil.indicadorInsEst = null
    this.perfil.inscricaoEstadual = ''
    this.perfil.inscricaoMunicipal = ''
    this.perfil.inscricaoSuframa = ''

  }

  cameraClick() {

    this.appUtil.uploadSelect(this.perfil, 'fotoPerfil', '.jpg', undefined, this.env.configs.FOTO_MAX_WIDTH, this.env.configs.FOTO_MAX_HEIGHT, this.env.configs.FOTO_QUALITY)
      .catch(err => this.appUtil.alertError(err))

  }

  estadoChange() {

    this.perfil.enderecoCidade = null
    this.perfil.enderecoCidadeId = null
    this.setEnderecoCidadeSelectData()

  }

  private setEnderecoCidadeSelectData() {

    this.perfil.enderecoCidadeSelectData = { text: this.perfil.enderecoCidade?.nomeCompleto || 'Selecione', id: this.perfil.enderecoCidadeId }

  }

}
