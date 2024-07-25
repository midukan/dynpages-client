import { Component, EventEmitter, HostBinding, Input, Output, SimpleChanges, ViewChild } from '@angular/core'
import { IonPopover, ModalController } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'

import { appDatetimeGroupParseDate, AppDatetimeGroupPeriodos, AppDatetimeGroupPeriodosStr } from './datetime-group.data'

export type AppDatetimeGroupTypes = 'dataGroup' | 'datahoraGroup'

@Component({
  selector: 'app-datetime-group',
  templateUrl: './datetime-group.component.html',
  styleUrls: ['./datetime-group.component.scss'],
})
export class DatetimeGroupComponent {

  validStart = true

  usuarioLogado: any

  isModal = false

  randomId = Math.random()

  periodo: AppDatetimeGroupPeriodos = AppDatetimeGroupPeriodos.TODO_PERIODO
  lastPeriodoSel: AppDatetimeGroupPeriodos
  periodos = Object.entries(AppDatetimeGroupPeriodos).map(pt => ({ label: AppDatetimeGroupPeriodosStr[pt[0]], value: pt[0] }))

  popoverPersonalizadoShow = false

  appModelInicialCustom: string | null
  appModelFinalCustom: string | null

  @Input() withTime = false
  @Input() placeholder: string
  @Input() color = null
  @Input() withHotkey = false
  @HostBinding('class.force-mobile') @Input() forceMobile: boolean = false

  @Input() appModelInicial: Date | string | null // 2020-12-15T13:47:20-03:00 ou 2020-12-15T16:47:20Z
  @Output() appModelInicialChange: EventEmitter<string | null> = new EventEmitter<string | null>()

  @Input() appModelFinal: Date | string | null // 2020-12-15T13:47:20-03:00 ou 2020-12-15T16:47:20Z
  @Output() appModelFinalChange: EventEmitter<string | null> = new EventEmitter<string | null>()

  @Input() appModelTipo: AppDatetimeGroupPeriodos | null // 2020-12-15T13:47:20-03:00 ou 2020-12-15T16:47:20Z
  @Output() appModelTipoChange: EventEmitter<AppDatetimeGroupPeriodos | null> = new EventEmitter<AppDatetimeGroupPeriodos | null>()

  @Output() appModelChange: EventEmitter<string | null> = new EventEmitter<string | null>()

  @ViewChild('popoverPersonalizado') popoverPersonalizado: IonPopover

  constructor(public authService: AuthService, public appUtil: AppUtil, private modalCtrl: ModalController) {

    this.usuarioLogado = this.authService.getAuth()

  }

  get log() {
    return console.log
  }

  ngOnChanges(changes: SimpleChanges) {

    let periodo: AppDatetimeGroupPeriodos | null = null

    if (changes.appModelTipo?.currentValue) {
      this.lastPeriodoSel = changes.appModelTipo?.currentValue
    }

    if (changes.appModelInicial?.currentValue || changes.appModelFinal?.currentValue) {

      Object.entries(AppDatetimeGroupPeriodos).forEach(dg => {

        if (periodo) return

        const ret = appDatetimeGroupParseDate(this.appUtil, AppDatetimeGroupPeriodos[dg[0]])

        if (ret && ret.dataInicial?.toJSON() === new Date(this.appModelInicial!).toJSON() && ret.dataFinal?.toJSON() === new Date(this.appModelFinal!).toJSON()) {
          periodo = AppDatetimeGroupPeriodos[dg[0]]
        }

      })

      if (!periodo && this.appModelInicial && this.appModelFinal) {
        periodo = AppDatetimeGroupPeriodos.PERSONALIZADO
      }

      this.periodo = periodo ? periodo : AppDatetimeGroupPeriodos.TODO_PERIODO

      if (!this.lastPeriodoSel) {
        this.lastPeriodoSel = this.periodo
      }

    }

  }

  async ionViewDidEnter() {

    this.isModal = !!(await this.modalCtrl.getTop())

  }

  dateChanged() {

    if (this.periodo === AppDatetimeGroupPeriodos.PERSONALIZADO && (this.appModelInicialCustom || this.appModelFinalCustom)) {

      this.appModelInicial = this.appModelInicialCustom

      if (this.appModelFinalCustom) {
        const dateFinal = new Date(this.appModelFinalCustom)
        if (!this.withTime) {
          dateFinal.setDate(dateFinal.getDate() + ((dateFinal.getHours() && dateFinal.getHours() < 12) ? 0 : 1)) // gambiarra para tz
          dateFinal.setHours(0)
          dateFinal.setMinutes(0)
          dateFinal.setSeconds(0)
          dateFinal.setMilliseconds(-1)
        }
        this.appModelFinal = new Date(dateFinal).toISOString()
      } else {
        this.appModelFinal = this.appModelFinalCustom
      }

      this.popoverPersonalizado.dismiss()

    }

    this.appModelInicialChange.next(this.appModelInicial ? new Date(this.appModelInicial).toJSON() : null)
    this.appModelFinalChange.next(this.appModelFinal ? new Date(this.appModelFinal).toJSON() : null)
    this.appModelTipoChange.next(this.appModelTipo)

    this.appModelChange.next(null)

  }

  setPeriodo() {

    const ret = appDatetimeGroupParseDate(this.appUtil, this.periodo)

    // console.log(ret)

    if (ret) {

      this.appModelInicial = ret.dataInicial?.toISOString() || null
      this.appModelFinal = ret.dataFinal?.toISOString() || null
      this.appModelTipo = ret.periodo || null

      this.dateChanged()

      // this.lastPeriodoSel = this.periodo
      this.lastPeriodoSel = ret.periodo

    } else {

      this.appModelInicialCustom = new Date(this.appModelInicial!).toJSON()
      this.appModelFinalCustom = new Date(this.appModelFinal!).toJSON()

      document.getElementById('open-popover-datetime-group' + this.randomId)?.click()

    }

  }

  stepPeriodo(direction: 'back' | 'forward') {

    const addSub = direction === 'back' ? -1 : 1

    let dateInicial = new Date(this.appModelInicial!)
    let dateFinal = new Date(this.appModelFinal!)

    const timeInicial = dateInicial.getTime() + (dateInicial.getUTCMilliseconds() * 0.001)
    const timeFinal = dateFinal.getTime() + (dateFinal.getUTCMilliseconds() * 0.001)
    const timeDiff = (0.001 + timeFinal - timeInicial) * addSub

    if (this.lastPeriodoSel === AppDatetimeGroupPeriodos.ESSE_MES || this.lastPeriodoSel === AppDatetimeGroupPeriodos.MES_ANTERIOR || this.lastPeriodoSel === AppDatetimeGroupPeriodos.PROXIMO_MES) {
      dateInicial.setMonth(dateInicial.getMonth() + addSub)
      dateFinal.setDate(1)
      dateFinal.setMonth(dateFinal.getMonth() + addSub + 1)
      dateFinal.setDate(0)
    } else if (this.lastPeriodoSel === AppDatetimeGroupPeriodos.ESSE_ANO) {
      dateInicial.setFullYear(dateInicial.getFullYear() + addSub)
      dateFinal.setFullYear(dateFinal.getFullYear() + addSub)
    } else if (this.lastPeriodoSel === AppDatetimeGroupPeriodos.ULTIMOS_12_MESES) {
      dateInicial.setFullYear(dateInicial.getFullYear() + addSub)
      dateFinal.setFullYear(dateFinal.getFullYear() + addSub)
    } else {
      dateInicial = new Date(timeInicial + timeDiff)
      dateFinal = new Date(timeFinal + timeDiff)
    }

    this.appModelInicial = dateInicial.toISOString()
    this.appModelFinal = dateFinal.toISOString()

    this.dateChanged()

  }

  popoverPersDismiss(e) {

    this.appModelInicialCustom = null;
    this.appModelFinalCustom = null;

    this.periodo = (e.detail.role === 'backdrop' || e.detail.role === 'cancelar') ? this.lastPeriodoSel : this.periodo

    this.popoverPersonalizadoShow = false;

  }

}
