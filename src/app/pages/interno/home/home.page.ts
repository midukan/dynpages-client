import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalController, Platform } from '@ionic/angular'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { MiscService } from 'src/app/providers/misc.service'
import { DateRange } from 'src/app/util'

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomeAdminPage extends BasePage {

  contrato: any

  contaReceberFilters = {
    pager: { limit: 10000, offset: 0, noSave: true }, // só precisa das estatística
    contaTipo: ["RECEBER"],
    contaPgtoStatus: ["ABERTO"],
    dataInicial: new Date('2020-01-01'),
    dataFinal: new Date,
  }

  contaPagarFilters = {
    pager: { limit: 10000, offset: 0, noSave: true }, // só precisa das estatística
    contaTipo: ["PAGAR"],
    contaPgtoStatus: ["ABERTO"],
    dataInicial: new Date('2020-01-01'),
    dataFinal: new Date,
  }

  fluxoCaixaFilters = {
    pager: { limit: 10000, offset: 0 },
    contaFluxoIntervalo: "DIARIO",
    contaTipo: [
      "RECEBER",
      "PAGAR"
    ],
    ano: new Date().getFullYear(),
    anoInicial: new Date().getFullYear(),
    anoFinal: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    dataInicial: new Date,
    dataFinal: new Date,
  }

  vendaFilters = {
    pager: { offset: 0, limit: 10000 },
    competenciaTipo: ["VENDA"],
    competenciStatus: ["APROVADO"],
    competenciaDirecao: ["CLIENTE"],
    tipoRelatorioVenda: "PRODUTO_AGRUPADO",
    dataTipo: "ESSE_MES",
    dataInicial: new Date,
    dataFinal: new Date,
  }

  stringEncrypt = ''
  stringDecrypt = ''

  stringEncryptResult = ''
  stringDecryptResult = ''
  apiTokenResult = ''

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    protected authService: AuthService,
    public appUtil: AppUtil,
    protected platform: Platform,
    protected route: ActivatedRoute,
    protected element: ElementRef,
    protected contratoService: ContratoService,
    protected miscService: MiscService,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

    this.setContrato()

    this.contratoService.entityUpdated.subscribe(async () => {

      await this.authService.loadAuthContrato(true)
      // .catch(err => { // não precisa pois já tem redir do possível erro daqui, de unauth
      //   this.authService.logout(true)
      //   this.appUtil.alertError(err)
      //   this.router.navigateByUrl(this.env.paths.noAuthUrl)
      // })

      this.setContrato()

    })

    this.setFCFiltersDate()

  }

  async ngOnInit() {

    await this.ngOnInitDefault()

  }

  async ionViewDidEnter() {

    this.setTitle('Administração', 'Painel de gestão da ' + this.env.infos.appName)

  }

  setFCFiltersDate() {

    const hoje = this.appUtil.getDateRange(DateRange.ULTIMOS_30_DIAS)

    this.contaReceberFilters.dataFinal = hoje.end
    this.contaPagarFilters.dataFinal = hoje.end

    const esteMes = this.appUtil.getDateRange(DateRange.ESTE_MES)

    this.fluxoCaixaFilters.dataInicial = esteMes.start
    this.fluxoCaixaFilters.dataFinal = esteMes.end

    const ult30Dias = this.appUtil.getDateRange(DateRange.ULTIMOS_30_DIAS)

    this.vendaFilters.dataInicial = ult30Dias.start
    this.vendaFilters.dataFinal = ult30Dias.end

  }

  setContrato() {

    this.contrato = this.authService.getContrato()

  }

  getPlanoValor() {

    const valor = this.env.planos[this.contrato.planoOpcao + '_VALOR_' + this.contrato.planoPeriodo] || 0
    const desconto = (100 - this.contrato.planoDesconto) / 100

    return valor * desconto

  }

  encriptarString() {

    this.miscService.encriptarString(this.stringEncrypt).subscribe(data => this.stringEncryptResult = data)

  }

  descriptarString() {

    this.miscService.descriptarString(this.stringDecrypt).subscribe(data => this.stringDecryptResult = data)

  }

  getTokenAPI() {

    this.miscService.getTokenAPI(this.stringDecrypt).subscribe(data => this.apiTokenResult = data)

  }

}
