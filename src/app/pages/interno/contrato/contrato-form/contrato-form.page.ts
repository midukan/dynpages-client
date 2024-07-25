import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { DataService } from 'src/app/providers/data.service'
import { MessageService } from 'src/app/providers/message.service'
import { SocketService } from 'src/app/providers/socket.service'
import { environment } from 'src/environments/environment'
import { PerfilCartaoPageService } from '../../perfil-cartao/perfil-cartao-page.service'
import { ContratoPageService } from '../contrato-page.service'

@Component({
  selector: 'app-contrato-form-page',
  templateUrl: './contrato-form.page.html',
  styleUrls: ['./contrato-form.page.scss']
})
export class ContratoFormPage extends FormPage {

  showForm = false

  contratoDefault: any = {
    tipo: environment.enums.ContratoTipo.PJ,
    nome: '',
    optanteSN: true,
    crt: environment.enums.ContratoCRT.SN,
  }
  contrato: any

  perfilCartoes: any[]

  contratoTipos = Object.entries(environment.enums.ContratoTipoStr).map(pt => ({ label: environment.enums.ContratoTipoStr[pt[0]], value: pt[0] }))
  contratoPlanoOpcoes = Object.entries(environment.enums.ContratoPlanoOpcaoStr).map(pt => ({ label: environment.enums.ContratoPlanoOpcaoStr[pt[0]], value: pt[0] }))
  contratoPlanoPeriodos = Object.entries(environment.enums.ContratoPlanoPeriodoStr).map(pt => ({ label: environment.enums.ContratoPlanoPeriodoStr[pt[0]], value: pt[0] }))
  contratoCRTs = Object.entries(environment.enums.ContratoCRTStr).map(pt => ({ label: environment.enums.ContratoCRTStr[pt[0]], value: pt[0] }))
  formaPgtos = Object.entries(environment.enums.ContratoFormaPgtoStr).map(pt => ({ label: environment.enums.ContratoFormaPgtoStr[pt[0]], value: pt[0] }))

  @ViewChild('enderecoCEP') enderecoCEP: any

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    private messageService: MessageService,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    private contratoService: ContratoService,
    protected element: ElementRef,
    protected contratoPageService: ContratoPageService,
    protected socketService: SocketService,
    private perfilCartaoPageService: PerfilCartaoPageService,
    private dataService: DataService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, contratoService, contratoPageService)

  }

  async ngOnInit() {

    // this.dataService.set('plano.selected', 1)
    // this.dataService.set('planoPeriodo.selected', 'MENSAL')

    await this.ngOnInitDefault('Empresa', 'contrato')

    this.showForm = this.isModal || !!this.contrato.id

    if (!this.isModal && this.authService.getContratos().length) {
      // Descomentar em produção
      // this.router.navigateByUrl(this.env.paths.isAuthUrlAdmin)
    }

    this.subtitle = this.subtitle.replace('registro', 'ambiente')

    this.contrato._estadoId = this.contrato.enderecoCidade?.estadoId
    this.setEnderecoCidadeSelectData()

  }

  setFiltersSelectData() {

  }

  documentoInputed() {

    const validaCNPJ = this.appUtil.validaCNPJ(this.contrato.documento)
    const validaCPF = this.appUtil.validaCPF(this.contrato.documento)

    setTimeout(() => {

      this.showForm = validaCNPJ || validaCPF

      if (this.showForm) {

        if (this.usuarioLogado.documento === this.contrato.documento) {

          // preencher dados do usuário logado

          this.contrato.nome = this.usuarioLogado.nomeCompleto

          this.contrato.telefone = this.usuarioLogado.celular || this.usuarioLogado.telefone
          this.contrato.email = this.usuarioLogado.email

          this.contrato.enderecoCEP = this.usuarioLogado.enderecoCEP

          this.contrato.enderecoNumero = this.usuarioLogado.enderecoNumero
          this.contrato.enderecoComplemento = this.usuarioLogado.enderecoComplemento

          setTimeout(() => {
            this.enderecoCEP.el.firstElementChild.dispatchEvent(new KeyboardEvent('keyup', {
              bubbles: true,
              cancelable: true,
              key: 'a',  // a tecla que deseja simular
              charCode: 0,
              keyCode: 65  // o código da tecla 'a'
            }))
          })

        } else if (validaCNPJ) {

          this.contrato.responsavelNome = this.usuarioLogado.nomeCompleto
          this.contrato.responsavelDocumento = this.usuarioLogado.documento
          this.contrato.responsavelEmail = this.usuarioLogado.email
          this.contrato.responsavelDataNascimento = this.usuarioLogado.dataNascimento

          this.contrato.telefone = this.usuarioLogado.celular || this.usuarioLogado.telefone
          this.contrato.email = this.usuarioLogado.email

        }

      }

    }, 500)

  }

  cartoes() {

    this.perfilCartaoPageService.modalList({ perfilId: [this.contrato.licenca?.competencia?.perfilId] })

  }

  async salvar() {

    const loading = await this.loadingCtrl.create({ message: 'Salvando...' })
    loading.present()

    this.contratoService.save({ contrato: this.contrato })
      .subscribe({
        next: async data => {

          this.appUtil.toast(
            this.contrato.id ? 'Ambiente alterado com sucesso.' : 'Ambiente criado com sucesso.',
            this.contrato.id ? 2000 : 2000, 'success')

          // Este não precisaria, mas agiliza o reload
          // this.contratoService.entityUpdated.next(data.contrato)

          // atualiza img do contrato na sessão
          this.authService.auth().subscribe(async () => {

            this.contratoService.entityUpdated.next(data.contrato)

            await this.authService.loadAuthContrato(true)

            if (this.isModal) {
              this.modalCtrl.dismiss({ contrato: data.contrato })
            } else {
              // this.router.navigateByUrl('/painel/' + data.contrato.id + '/plano') // Versão no interno
              this.router.navigateByUrl('/painel/' + data.contrato.id + '/configurar-plano') // Versão fora do interno
            }

            loading.dismiss()

          })

        }, error: err => {

          this.errors = err.message

          loading.dismiss()

          if (typeof err.message === 'string') this.appUtil.alertError(err)

        }
      })

  }

  cameraClick() {

    this.appUtil.uploadSelect(this.contrato, 'logo', '.jpg,.png', undefined, this.env.configs.FOTO_MAX_WIDTH, this.env.configs.FOTO_MAX_HEIGHT, this.env.configs.FOTO_QUALITY)
      .catch(err => this.appUtil.alertError(err))

  }

  certificadoOpenDialog(files?: FileList) {

    const maxSize = 100 // 100kb

    this.appUtil.uploadSelect(this.contrato, 'certificadoA1', '.pfx, .p12, .cer, .crt, .pem, .PFX, .P12, .CER, .CRT, .PEM',
      undefined, undefined, undefined, undefined, undefined, files)
      .then(files => {

        files.forEach((file, idx) => {

          if (file.size > maxSize * 1024) {

            this.appUtil.alertError('Tamanho máximo do anexo é de: ' + maxSize + 'kb')
            file.entity.certificadoA1Upload = undefined

          }

        })

      })
      .catch(err => this.appUtil.alertError(err))

  }

  removeCertificado() {

    if (this.contrato.certificadoA1Upload) {
      this.contrato.certificadoA1Upload = undefined
    } else {
      this.contrato.certificadoA1Delete = true
    }

  }

  estadoChange() {

    this.contrato.enderecoCidade = null
    this.contrato.enderecoCidadeId = null
    this.setEnderecoCidadeSelectData()

  }

  private setEnderecoCidadeSelectData() {

    this.contrato.enderecoCidadeSelectData = { text: this.contrato.enderecoCidade?.nomeCompleto || 'Selecione', id: this.contrato.enderecoCidadeId }

  }

}
