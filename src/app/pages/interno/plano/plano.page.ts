import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonContent, LoadingController, ModalController, Platform } from '@ionic/angular'
import { firstValueFrom } from 'rxjs'
import { IBasicBodyData } from 'src/app/abstracts/backend-service.abstract'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { PlanoPeriodo } from 'src/app/components/app/planos/planos.component'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { DataService } from 'src/app/providers/data.service'
import { MiscService } from 'src/app/providers/misc.service'
import { PerfilCartaoService } from 'src/app/providers/perfil-cartao.service'
import { SocketService } from 'src/app/providers/socket.service'
import { environment } from 'src/environments/environment'
import { ContratoPageService } from '../contrato/contrato-page.service'
import { PerfilCartaoPageService } from '../perfil-cartao/perfil-cartao-page.service'

@Component({
  selector: 'app-plano-page',
  templateUrl: './plano.page.html',
  styleUrls: ['./plano.page.scss']
})
export class PlanoPage extends FormPage {

  contratoDefault: any = {}
  contrato: any

  perfilCartoes: any[]

  planoAtual: number | null = 0
  planoPeriodoAtual: PlanoPeriodo
  formaPgtoAtual: string

  planoSel: number | null = 0
  planoPeriodo: PlanoPeriodo = 'ANUAL'
  planoFormaPgto = 'CARTAO_DE_CREDITO_AUTOMATIZADO'

  formaPgtos = Object.entries(environment.enums.ContratoFormaPgtoStr).map(pt => ({ label: environment.enums.ContratoFormaPgtoStr[pt[0]], value: pt[0] }))

  cartaoAddInfo = false

  @ViewChild(IonContent) content: IonContent

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
    public dataService: DataService,
    public contratoPageService: ContratoPageService,
    public perfilCartaoPageService: PerfilCartaoPageService,
    protected loadingCtrl: LoadingController,
    protected socketService: SocketService,
    protected perfilCartaoService: PerfilCartaoService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, contratoService, contratoPageService)

    // this.dataService.set('plano.selected', 1)
    // this.dataService.set('planoPeriodo.selected', 'TRIMESTRAL')

    this.setUpdateProps()
    this.loadCartoes()

    this.contratoService.entityUpdated.subscribe(async () => {

      this.authService.auth().subscribe(async data => {
        await this.authService.loadAuthContrato(true)
        this.contrato = this.appUtil.deepCopy(this.authService.getContrato())
        this.setUpdateProps(true)
        this.loadCartoes()
      })

    })

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Plano', 'contrato')

    this.contrato = this.appUtil.deepCopy(this.authService.getContrato())

  }

  async ionViewDidEnter() {

    this.setTitle('Plano', 'Selecione o plano e o prazo de pagamento')

  }

  setFiltersSelectData() {
    throw new Error('Method not implemented.')
  }

  async loadCartoes() {

    const perfilCartoesData = await firstValueFrom(this.perfilCartaoService.getMany({ perfilId: [this.authService.getContrato().cleanfinId], pager: { limit: 20 } }))
      .catch(err => this.appUtil.alertError(err))

    if (perfilCartoesData) {
      this.perfilCartoes = perfilCartoesData.perfilCartoes
    }

  }

  setUpdateProps(dontUpdateChangers = false) {

    this.planoAtual = (this.dataService.get('plano.selected') !== null) ? null : +this.authService.getContrato().planoOpcao.split('_').pop()
    this.planoPeriodoAtual = this.authService.getContrato().planoPeriodo
    this.formaPgtoAtual = this.authService.getContrato().planoFormaPgto

    if (!dontUpdateChangers) {
      this.planoSel = (this.dataService.get('plano.selected') !== null) ? +this.dataService.get('plano.selected') : +this.authService.getContrato().planoOpcao.split('_').pop()
      this.planoPeriodo = (this.dataService.get('planoPeriodo.selected') !== null) ? this.dataService.get('planoPeriodo.selected') : this.authService.getContrato().planoPeriodo
      this.planoFormaPgto = this.authService.getContrato().planoFormaPgto || this.env.enums.ContratoFormaPgto.CARTAO_DE_CREDITO_AUTOMATIZADO // this.authService.getContrato() vem vazio inicialmente na criação de conta
    }

  }

  cancelaSubstituicao() {

    this.contrato.planoOpcaoSubstituto = null
    this.contrato.planoPeriodoSubstituto = null
    this.contrato.planoFormaPgtoSubstituto = null

    this.salvar()

  }

  async beforeSave(): Promise<boolean | void> {

    if (this.planoFormaPgto === this.env.enums.ContratoFormaPgto.CARTAO_DE_CREDITO_AUTOMATIZADO && !this.perfilCartoes?.length) {
      this.appUtil.alertError('Você precisa informar um cartão de crédito para continuar.')
      return false
    }

    this.contrato.planoOpcao = 'PLANO_' + this.planoSel
    this.contrato.planoPeriodo = this.planoPeriodo
    this.contrato.planoFormaPgto = this.planoFormaPgto

    this.contrato._isPlanoAlteracao = true

  }

  async afterSave(data?: IBasicBodyData): Promise<void> {

    if (this.planoAtual === null) {
      this.router.navigateByUrl('/painel/' + this.authService.getContrato().id + '/home')
    } else {
      if (this.calculaPlanoValor() < this.calculaPlanoValor(true)) {
        this.planoSel = this.planoAtual
        this.planoPeriodo = this.planoPeriodoAtual
        this.planoFormaPgto = this.formaPgtoAtual
      }
    }

    this.contratoService.entityUpdated.next(null)

    // this.appUtil.toast('Plano ' + (this.planoAtual !== null ? 'alterado' : 'assinado') + ' com sucesso.', 5000, 'success')
    this.appUtil.alertMessage({
      title: 'Parabéns!',
      message: `
      <p>O plano foi ` + (this.planoAtual !== null ? `alterado` : `assinado`) + ` com sucesso.</p>` +
        (this.dataService.get('plano.selected') ? ((this.formaPgtoAtual !== this.env.enums.ContratoFormaPgto.CARTAO_DE_CREDITO_AUTOMATIZADO)
          ? `<p class="font-weight-600">Você deve efetuar hoje pagamento do boleto ou pix enviado em seu email.</p>`
          : `<p class="font-weight-600">Sempre mantenha ao menos 1 cartão válido para que não haja falha na cobrança e suspensão dos serviços.</p>`) : ''),
    })

    this.dataService.set('plano.selected', null)
    this.dataService.set('planoPeriodo.selected', null)

  }

  selecionaPlano(planoNum: number, planoPeriodo: PlanoPeriodo) {

    this.planoSel = planoNum
    this.planoPeriodo = planoPeriodo

    if (planoNum) {
      setTimeout(() => this.scrollToBlock('resumo'))
    }

    // const plano = 'PLANO_' + planoNum // 0 ao 3
    // this.dataService.set('plano.selected', plano)

  }

  async cartaoAdd(perfilCartao: any) {

    // Faz liberar para confirmar assinatura
    this.contratoService.entityUpdated.next(null)

    this.cartaoAddInfo = true

  }

  scrollToBlock(elemId: string) {

    // planos, resumo

    const elem = document.getElementById(elemId)

    this.content.scrollToPoint(0, elem!.offsetTop, 1000)

  }

  calculaPlanoValor(forcePlanoAtual = false) {

    const planoOpcao = (forcePlanoAtual && this.planoAtual !== null) ? this.planoAtual : this.planoSel
    const planoPeriodo = (forcePlanoAtual && this.planoAtual !== null) ? this.planoPeriodoAtual : this.planoPeriodo

    let valor = this.env.planos['PLANO_' + planoOpcao + '_VALOR_' + planoPeriodo]

    valor -= (valor / 100) * this.authService.getContrato().planoDesconto

    return valor

  }

  calculaPlanoProporcaoMensal() {

    const mapMonths = {
      [this.env.enums.ContratoPlanoPeriodo.MENSAL]: 1,
      [this.env.enums.ContratoPlanoPeriodo.TRIMESTRAL]: 3,
      [this.env.enums.ContratoPlanoPeriodo.SEMESTRAL]: 6,
      [this.env.enums.ContratoPlanoPeriodo.ANUAL]: 12,
    }

    let valor = Math.round(this.env.planos['PLANO_' + this.planoSel + '_VALOR_' + this.planoPeriodo] / mapMonths[this.planoPeriodo])

    valor -= (valor / 100) * this.authService.getContrato().planoDesconto

    return valor

  }

  cartoes() {

    this.perfilCartaoPageService.modalList({ perfilId: [this.authService.getContrato().cleanfinId] })

  }

}
