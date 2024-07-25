import { Component, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';

@Directive({
  selector: '[hotkey]'
})
export class HotkeyDirective {

  private keyCombination: string = ''
  private textCombination: string = ''

  private popover: HTMLIonPopoverElement | undefined

  private to: any

  @Input('hotkey') hotkey: string | null
  @Input('hotkey-popover') hotkeyPopover = true
  @Output() onHotkey: EventEmitter<any> = new EventEmitter()

  constructor(
    private el: ElementRef,
    private popoverController: PopoverController,
    private platform: Platform,
  ) { }

  ngOnInit() {

    if (!this.hotkey) return

    this.keyCombination = this.hotkey.toLowerCase()
    this.textCombination = this.hotkey.toUpperCase()

  }

  ngOnDestroy() {
    this.removeInfoText()
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event) {
    this.showInfoText(event);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    this.removeInfoText();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (window.innerWidth <= (window as any).GLOBAL_MOBILE_WIDTH || !this.hotkey || (document.activeElement && document.activeElement.tagName === 'INPUT')) return

    const key = event.key.toLowerCase()
    const modifiers: string[] = []

    if (event.ctrlKey) modifiers.push('ctrl')
    if (event.shiftKey) modifiers.push('shift')
    if (event.altKey) modifiers.push('alt')
    if (event.metaKey) modifiers.push('meta')

    const modifierKeys = modifiers.join('+')
    const combination = modifierKeys + (modifiers.length > 0 ? '+' : '') + key

    if (combination === this.keyCombination) {

      if (this.el.nativeElement.closest('.ion-page-hidden')) return

      const modalPai = this.el.nativeElement.closest('ion-modal')

      if (modalPai) {

        const irmaosMesmoTipo = Array.from<any>(modalPai.parentNode.children).filter((elemento) => elemento.tagName === modalPai.tagName)
        const isLastModal = irmaosMesmoTipo.findIndex(irmao => irmao === modalPai) === irmaosMesmoTipo.length - 1

        if (!isLastModal) return

      }

      event.preventDefault()
      this.onHotkey.emit()

      // console.log('HK: ', this.hotkey)

    }

  }

  private async showInfoText(event) {

    this.to = setTimeout(async () => {

      // this.platform.is('mobile') // saindo true no FF

      if (window.innerWidth <= (window as any).GLOBAL_MOBILE_WIDTH || !this.hotkey || !this.hotkeyPopover) return

      const isNotFooter = this.el.nativeElement.getBoundingClientRect().top + 100 < window.innerHeight

      let text = this.textCombination

      text = text.replace('ARROW', '')
      text = text.replace('LEFT', '◀')
      text = text.replace('RIGHT', '▶')

      this.popover = await this.popoverController.create({
        component: PopoverContentComponent,
        componentProps: {
          text,
          isSmall: this.el.nativeElement.clientWidth < 50,
          popover: this.popover
        },
        cssClass: 'popover-tip' + ((this.el.nativeElement.getBoundingClientRect().top + 100 < window.innerHeight) ? '' : ' popover-tip-footer'),
        event: event,
        alignment: 'center',
        side: isNotFooter ? 'bottom' : 'top',
        mode: 'ios',
        size: 'cover',
        arrow: isNotFooter,
        showBackdrop: false,
        backdropDismiss: true,
        translucent: false,
      })

      this.popover?.present();

    }, 1000)

  }

  private async removeInfoText() {

    clearTimeout(this.to)

    await this.popover?.dismiss()
    await this.popover?.remove()
    // await this.popoverController.getTop().then(async top => {
    //   if (!top?.className.includes('popover-tip')) return
    //   await top?.dismiss()
    //   await top?.remove()
    // })

    this.popover = undefined

  }

}

@Component({
  selector: 'popover-content',
  template: `
    <div (click)="popover.dismiss()" class="bg-color-white color-dark text-center" 
    style="word-break: keep-all; word-wrap: normal;"
    [style.padding]="isSmall ? '3px 2px' : '5px'"
    [style.font-weight]="isSmall ? '500' : '600'"
    [style.font-size]="isSmall ? '8px' : '10px'">
    {{ text }}
  </div>
  `
})
class PopoverContentComponent {
  text: string;
  isSmall: boolean;
  popover: HTMLIonPopoverElement

}
