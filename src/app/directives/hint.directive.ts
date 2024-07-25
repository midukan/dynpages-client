import { Component, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';

@Directive({
  selector: '[title]'
})
export class HintDirective {

  private popover: HTMLIonPopoverElement | undefined

  private to: any

  @Input('title') title: string | null | undefined
  @Input('hotkey') hotkey: string | null | undefined
  @Input('hintWidth') hintWidth: number

  @Output() onTitle: EventEmitter<any> = new EventEmitter()

  constructor(
    private el: ElementRef,
    private popoverController: PopoverController,
    private platform: Platform,
  ) { }

  ngOnInit() {

    // não roda se tiver hotkey
    if (!this.title) return

    this.el.nativeElement.title = ''

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

  private async showInfoText(event) {

    // this.platform.is('mobile') // saindo true no FF

    this.to = setTimeout(async () => {

      if (window.innerWidth <= (window as any).GLOBAL_MOBILE_WIDTH || !this.title) return

      const isNotFooter = this.el.nativeElement.getBoundingClientRect().top + 100 < window.innerHeight

      this.popover = await this.popoverController.create({
        component: PopoverContentComponent,
        componentProps: {
          text: this.title,
          isSmall: this.el.nativeElement.clientWidth < 50,
          popover: this.popover,
        },
        cssClass: 'popover-tip ' + (this.hotkey ? 'popover-tip-with-hotkey' : '') + ' ' + ((this.el.nativeElement.getBoundingClientRect().top + 100 < window.innerHeight) ? '' : ' popover-tip-footer'),
        event: event,
        alignment: 'center',
        side: isNotFooter ? 'bottom' : 'top',
        mode: 'ios',
        size: this.hintWidth ? 'auto' : 'cover',
        arrow: isNotFooter,
        showBackdrop: false,
        backdropDismiss: true,
        translucent: false,
      })

      if (this.hintWidth) this.popover.style.setProperty('--width', this.hintWidth + 'px')

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
    <span (click)="popover.dismiss()" class="bg-color-white color-dark text-center" 
    style="word-break: keep-all; word-wrap: normal;"
    [style.padding]="isSmall ? '3px 2px' : '5px'"
    [style.font-weight]="isSmall ? '500' : '600'"
    [style.font-size]="isSmall ? '8px' : '10px'">
    {{ text }}
  </span>
  `
})
class PopoverContentComponent {
  text: string;
  isSmall: boolean;
  popover: HTMLIonPopoverElement
}
