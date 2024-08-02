import { Component, EventEmitter, Input, Output } from '@angular/core'
import { AppUtil } from 'src/app/app-util'
import { PoliticaTermosPageService } from 'src/app/pages/site/politica-termos/politica-termos-page.service'
import { AuthService } from 'src/app/providers/auth.service'
import { environment } from 'src/environments/environment'

export type PlanoPeriodo = 'MENSAL' | 'TRIMETRAL' | 'SEMESTRAL' | 'ANUAL'

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss'],
})
export class PlanosComponent {

  env = environment

  usuarioLogado: any

  validStart: boolean | null = null

  @Input() planoAtual: number | null = null
  @Input() planoSel: number | null = null
  @Input() planoPeriodo: PlanoPeriodo = 'MENSAL'
  @Input() modo: 'button' | 'radio'
  @Output() planoSelecionado: EventEmitter<{ planoNum: number, planoPeriodo: PlanoPeriodo, acao: 'plano' | 'periodo' }> = new EventEmitter()

  constructor(
    public authService: AuthService,
    public appUtil: AppUtil,
    public politicaTermosPageService: PoliticaTermosPageService,
  ) {

    this.usuarioLogado = this.authService.getAuth()

  }

  ngOnInit() {

    this.validStart = true

  }

  calculaPlanoProporcaoMensal(periodo: PlanoPeriodo, planoNum: number) {

    const mapMonths = {
      [this.env.enums.ContratoPlanoPeriodo.MENSAL]: 1,
      [this.env.enums.ContratoPlanoPeriodo.TRIMESTRAL]: 3,
      [this.env.enums.ContratoPlanoPeriodo.SEMESTRAL]: 6,
      [this.env.enums.ContratoPlanoPeriodo.ANUAL]: 12,
    }

    return Math.round(this.env.planos['PLANO_' + planoNum + '_VALOR_' + periodo] / mapMonths[periodo])

  }

  calculaPlanoProporcaoMensalDesconto(periodo: PlanoPeriodo, planoNum: number) {

    const valorMensal = this.env.planos['PLANO_' + planoNum + '_VALOR_MENSAL']
    const proporcaoMensal = this.calculaPlanoProporcaoMensal(periodo, planoNum)

    return valorMensal ? (100 - (100 / valorMensal * proporcaoMensal)) : 0

  }

  selecionaPlanoPeriodo(periodo: PlanoPeriodo) {

    this.planoPeriodo = periodo
    this.planoSel = null

    this.planoSelecionado.next({ planoNum: this.planoSel!, planoPeriodo: this.planoPeriodo, acao: 'periodo' })

  }

  selecionaPlano(planoNum: number) {

    this.planoSel = planoNum

    this.planoSelecionado.next({ planoNum: this.planoSel!, planoPeriodo: this.planoPeriodo, acao: 'plano' })

  }

}
