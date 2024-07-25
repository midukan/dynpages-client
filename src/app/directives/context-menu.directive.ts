import { CommonModule } from '@angular/common';
import { Component, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { IonicModule, Platform, PopoverController } from '@ionic/angular';

export interface IContextMenuItem {
  text: string,
  click: (itemData: any, event: any) => void
}

@Directive({
  selector: '[app-contextmenu]'
})
export class ContextMenuDirective {

  private popover: HTMLIonPopoverElement | undefined
  private toLongPress: any

  @Input('app-contextmenu') menuItems: IContextMenuItem[]
  @Input('app-contextmenu-data') itemData: any

  constructor(
    private el: ElementRef,
    private popoverController: PopoverController,
    private platform: Platform,
  ) { }

  ngOnInit() {



  }

  ngOnDestroy() {
    this.removePopover()
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event) {
    this.showPopover(event);
    event.preventDefault();
    return false
  }

  @HostListener('press', ['$event'])
  onPress(event) {
    this.toLongPress = setTimeout(() => {
      this.showPopover(event);
    }, 500)
    event.preventDefault();
    return false
  }

  @HostListener('pressup', ['$event'])
  onPressUp(event) {
    if (this.toLongPress) clearTimeout(this.toLongPress)
  }

  private async showPopover(event) {

    if (!this.menuItems?.length) return

    const isNotFooter = this.el.nativeElement.getBoundingClientRect().top + 100 < window.innerHeight

    this.popover = await this.popoverController.create({
      component: PopoverContentComponent,
      componentProps: {
        menuItems: this.menuItems,
        itemData: this.itemData,
      },
      cssClass: 'popover-contextmenu ' + ((this.el.nativeElement.getBoundingClientRect().top + 100 < window.innerHeight) ? '' : ' popover-contextmenu-footer'),
      event: event,
      alignment: 'center',
      side: isNotFooter ? 'bottom' : 'top',
      mode: 'ios',
      size: 'auto',
      arrow: isNotFooter,
      showBackdrop: true,
      backdropDismiss: true,
      translucent: false,
      dismissOnSelect: true,
    })

    this.popover?.present();

  }

  private async removePopover() {

    await this.popover?.dismiss()
    await this.popoverController.getTop().then(top => top?.dismiss())

    this.popover = undefined

  }

}

@Component({
  selector: 'popover-contextmenu',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
  template: `
    <div class="padding-5 font-size-10 text-center font-weight-600" 
      style="word-break: keep-all; word-wrap: normal;">

    <ion-list class="ion-no-padding">

      <ion-item *ngFor="let item of menuItems" button [detail]="false" lines="none" 
        (click)="item.click(itemData, $event)">
        {{ item.text }}
      </ion-item>

    </ion-list>

  </div>
  `
})
class PopoverContentComponent {
  menuItems: any[]
  itemData: any
}
