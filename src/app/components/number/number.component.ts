import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ThemeColors } from 'src/app/util'

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent {

  ngModelStr: string

  @Input() fill: 'outline' | 'solid' = 'outline'
  @Input() color: ThemeColors = 'medium'
  @Input() colorSelected: ThemeColors = 'black'
  @Input() size: 'default' | 'large' = 'default'
  @Input() allowEmpty = false
  @Input() allowUncheck = false
  @Input() disabled = false
  // @Input() min = 0
  // @Input() max = 999
  @Input() type: 'default' | 'radio' | 'radio3' | 'yesno' = 'default'
  @Input() icons: { left?: string, middle?: string, right?: string, textoEsquerda?: string, textoCentro?: string, textoDireita?: string } = { left: 'remove', middle: '', right: 'add', textoEsquerda: '', textoDireita: '' }
  _min: number
  _max: number
  _ngModel: number | boolean | null

  @Output() ngModelChange: EventEmitter<number | boolean | null> = new EventEmitter<number | boolean | null>()
  @Output() appChange: EventEmitter<number | boolean | null> = new EventEmitter<number | boolean | null>()

  constructor() {

  }

  set ngModel(num) {
    this._ngModel = num
    this.ngModelStr = ((num !== null ? num : '') + '') || ''
    this.ngModelChange.emit(this._ngModel)
  }
  @Input()
  get ngModel() {
    return this._ngModel;
  }

  set min(num) {
    this._min = num || 0
    setTimeout(() => {
      this.testInput()
    })
  }
  @Input()
  get min() {
    return this._min || 0
  }

  set max(num) {
    this._max = num || 999
    setTimeout(() => {
      this.testInput()
    })
  }
  @Input()
  get max() {
    return this._max || 999
  }

  ngOnInit() {

    setTimeout(() => {

      if (this.ngModel === undefined && this.type === 'default') this.ngModel = 0

      this.ngModelStr = (this.ngModel !== null ? this.ngModel : '') + ''

      if (!this.allowEmpty) {
        this.minMax()
      }

    })

  }

  // ngOnChanges(changes: SimpleChanges) {

  //   if (changes.ngModel?.currentValue) {

  //     this.ngModel = changes.ngModel?.currentValue

  //   }

  // }

  sub() {

    if (this.type === 'default') {

      this.ngModel = this.ngModel !== null ? this.ngModel as number - 1 : -1
      this.update()
      this.minMax()

    } else if (['radio', 'radio3', 'yesno'].includes(this.type)) {

      if (this.allowUncheck) {
        if (this.ngModel === 1 || this.ngModel === true) {
          this.ngModel = null
          this.update()
          return
        }
      }

      this.ngModel = (typeof this.ngModel === 'boolean') ? true : 1
      this.update()

    }

  }

  middle() {

    if (this.type === 'radio3') {

      if (this.allowUncheck) {
        if (this.ngModel === 0) {
          this.ngModel = null
          this.update()
          return
        }
      }

      this.ngModel = 0
      this.update()

    }

  }

  add() {

    if (this.type === 'default') {

      this.ngModel = this.ngModel !== null ? this.ngModel as number + 1 : 1
      this.update()
      this.minMax()

    } else if (['radio', 'radio3'].includes(this.type)) {

      if (this.allowUncheck) {
        if (this.ngModel === 2) {
          this.ngModel = null
          this.update()
          return
        }
      }

      this.ngModel = 2
      this.update()

    } else if (['yesno'].includes(this.type)) {

      if (this.allowUncheck) {
        if (this.ngModel === 0 || this.ngModel === false) {
          this.ngModel = null
          return
        }
      }

      this.ngModel = (typeof this.ngModel === 'boolean') ? false : 0
      this.update()

    }

  }


  testInput(isBlur = false) {

    if (this.allowEmpty && this.ngModelStr === '') {
      this.ngModel = null
      this.update()
      return
    }

    if (this.ngModelStr === '-') {
      this.ngModelStr = '0'
    }

    if (!+this.ngModelStr && this.ngModelStr?.length && this.ngModelStr !== '0') {

      this.ngModelStr = this.ngModel + ''

    } else {

      this.ngModelStr = (+this.ngModelStr) + ''


      this.ngModel = +this.ngModelStr

    }

    this.minMax(isBlur)

  }

  minMax(isBlur = false) {

    const prevVal = this.ngModel

    if (this.type === 'default' && this._min !== undefined && this._max !== undefined) {

      this.ngModel = Math.min(this._max, Math.max(this._min, this.ngModel as number || 0))

    }

    if (isBlur || prevVal !== this.ngModel) {
      this.update()
    }

  }


  update() {

    //this.ngModelStr = this.ngModel + ''

    this.ngModelChange.emit(this.ngModel)
    this.appChange.emit(this.ngModel)

  }

}
