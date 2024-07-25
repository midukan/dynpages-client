import { Directive, ElementRef, HostListener, Input } from '@angular/core'
import { NgModel } from '@angular/forms'
import { IonInput } from '@ionic/angular'

import { AppUtil } from '../app-util'

@Directive({
  selector: '[appMoneyMasker]'
})

export class MoneyMaskerDirective {

  oldValue: string

  @Input('appMoneyMasker') decimals: number | string = 2

  @HostListener('keyup', ['$event']) hlClick(e) {
    this._onKeyUp(e)
  }

  @HostListener('ionFocus', ['$event']) hlFocus(e) {
    this._onFocus(e)
  }

  constructor(public element: IonInput, public elementRef: ElementRef, private ngModel: NgModel, private appUtil: AppUtil) {

  }

  ngOnInit() {

    this.decimals = (this.decimals === '') ? 2 : +this.decimals

  }

  public _onFocus(event: any) {

    const inputElement = this.elementRef.nativeElement.querySelector('input')

    let value: number = +('' + this.element.value).replace(/[\D.,]/g, '') || 0

    if (value === 0) {
      inputElement.setSelectionRange((this.element.value + '').length, (this.element.value + '').length)
    }

  }

  public _onKeyUp(event: KeyboardEvent) {

    const inputElement = this.elementRef.nativeElement.querySelector('input')

    let posicaoCursor = inputElement.selectionStart

    let value: number = +('' + this.element.value).replace(/[\D.,]/g, '') || 0

    if (this.decimals) {
      value = value / Math.max(10 ** +this.decimals, 1)
    }

    this.element.value = this.appUtil.dinheiro(value, false, +this.decimals)

    this.ngModel.viewToModelUpdate(this.element.value)

    const diffTamanho = this.element.value.length - (this.oldValue || this.element.value).length

    // console.log(posicaoCursor, this.element.value)

    // if (posicaoCursor - 1 !== this.element.value.length) {

    if (diffTamanho === 2) {
      posicaoCursor++
    }
    if (diffTamanho === -2) {
      posicaoCursor--
    }

    if (value < 0.99) {
      posicaoCursor++
    }

    // }

    if (this.oldValue !== this.element.value) {
      inputElement.setSelectionRange(posicaoCursor, posicaoCursor)
    }

    this.oldValue = this.element.value

  }

}
