import { DatePipe } from '@angular/common'
import { Component, EventEmitter, HostBinding, Input, Output, SimpleChanges } from '@angular/core'
import { AppUtil } from 'src/app/app-util'

import { environment } from 'src/environments/environment'
import { TooltipContents } from '../tooltip/tooltip.data'

export type AppDatetimeTypes = 'dataInicial' | 'dataFinal' | 'datahoraInicial' | 'datahoraFinal'

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss']
})
export class DatetimeComponent {

  validStart = true

  dateStr: string | null
  dateIon: string | null

  dateFormat = 'dd/MM/yyy'
  timezone: string | undefined

  randomId = Math.random()

  selfSet = false

  isOpen = false

  content: keyof typeof TooltipContents

  @Input() layout: 'filter' | 'form' = 'form'
  @Input() withTime = false
  @Input() required = false
  @Input() label: string
  @Input() placeholder: string
  @Input() min: string // 2020-12-15T13:47:20-03:00 ou 2020-12-15T16:47:20Z
  @Input() max: string // 2020-12-15T13:47:20-03:00 ou 2020-12-15T16:47:20Z
  @Input() color = null
  @Input() disabled = false
  @Input() offsetY = -200;
  @Input() noCalendar = false
  @Input() noBorder = false
  @Input() tooltip: keyof typeof TooltipContents | string
  @HostBinding('class.force-mobile') @Input() forceMobile: boolean = false

  @Input() appModel: string | null // 2020-12-15T13:47:20-03:00 ou 2020-12-15T16:47:20Z
  @Output() appModelChange: EventEmitter<string | null> = new EventEmitter<string | null>

  constructor(public appUtil: AppUtil, private datePipe: DatePipe) {

  }

  get log() {
    return console.log
  }

  ngOnInit() {

    if (!this.placeholder) {
      const mask = this.withTime ? '00/00/0000 00:00' : '00/00/0000'
      this.placeholder = this.layout === 'form' ? ('' + (this.required ? 'Obrigatório' : 'Opcional')) : 'Todo período' //  + ' (' + mask + ')'
    }

    if (this.withTime) {
      this.dateFormat = this.dateFormat + ' HH:mm'
    }

    this.timezone = this.withTime ? undefined : environment.configs.DATE_ONLY_TIMEZONE

    if (this.appModel) {
      this.setAppModel()
    }

    if (!this.min) {
      const min = new Date()
      min.setUTCFullYear(min.getUTCFullYear() - 100)
      this.min = min.toJSON()
    }

    if (!this.max) {
      const max = new Date()
      max.setUTCFullYear(max.getUTCFullYear() + 10)
      this.max = max.toJSON()
    }

    if (this.isContent()) {
      this.content = this.tooltip as keyof typeof TooltipContents
    }

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.appModel?.currentValue) {

      if (this.selfSet) {
        this.selfSet = false
        return
      }

      this.setAppModel()

    }

  }

  isContent() {

    return (typeof this.tooltip !== 'string')

  }

  setAppModel() {

    this.dateStr = this.datePipe.transform(this.appModel, this.dateFormat, this.timezone)

    if (this.appModel === null) {
      return
    }

    const date = new Date(this.appModel)
    date.setMinutes(date.getMinutes() + (this.withTime ? -date.getTimezoneOffset() : environment.configs.DATE_ONLY_TIMEZONE_OFFSET)) // -180
    this.dateIon = date.toJSON()

  }

  inputChanged() {

    if (!this.dateStr) {
      this.dateIon = null
      this.setNgModel()
      return
    }

    const [data, hora] = this.dateStr.split(' ')

    if (data.length !== 10 || (this.withTime && hora?.length !== 5)) {
      return
    }

    const dateMin = new Date(this.min)
    const dateMax = new Date(this.max)

    let date = this.appUtil.strToDate(data, hora)

    let dateAdjuste = false

    if (date < dateMin) {
      date = dateMin
      dateAdjuste = true
    }

    if (date > dateMax) {
      date = dateMin
      dateAdjuste = true
    }

    if (dateAdjuste) {
      this.dateStr = this.datePipe.transform(date, this.dateFormat, this.timezone)
    }

    date.setHours(date.getHours() - date.getTimezoneOffset() / 60) // minutos para horas
    this.dateIon = date.toJSON()

    this.setNgModel()

  }

  ionChanged() {

    this.dateStr = this.datePipe.transform(this.dateIon, this.dateFormat, this.timezone)

    this.setNgModel()

  }

  setNgModel() {

    this.selfSet = true

    if (!this.dateStr) {

      this.appModel = null

    } else {

      const [data, hora] = this.dateStr.split(' ')
      this.appModel = this.appUtil.strToDate(data, hora).toJSON()

    }

    this.appModelChange.next(this.appModel);

    // this.popoverCtrl.getTop().then(popover => popover.dismiss())

  }

}
