import { AfterContentInit, Directive, ElementRef, NgZone, OnDestroy, Renderer2, RendererStyleFlags2 } from '@angular/core'

import { MessageService } from '../providers/message.service'

@Directive({
  selector: 'ion-content, [modal-adjust-content]'
})

export class ModalAdjustDirective implements AfterContentInit, OnDestroy {

  ajustaModalTO: any

  oldHeight = 0

  constructor(public element: ElementRef, public renderer: Renderer2, private ngZone: NgZone, private messageService: MessageService) {

    // this.messageService.get('modal.adjust').subscribe(() => {
    //   this.ajustaModal()
    // })

  }

  ngOnInit() {

    this.ajustaModal()

  }

  ngAfterContentInit() {

    // this.ngZone.runOutsideAngular(() => {})

    setTimeout(() => {
      this.ajustaModal()
    })

    let ta = 0
    const a = setInterval(() => {
      this.ajustaModal()
      if (++ta >= 20) {
        clearInterval(a)
      }
    }, 100)

    // this.ajustaModalTO = setInterval(() => {

    //   this.ajustaModal()

    // }, 3000)

    this.messageService.get<number>('modal.resize').subscribe((delayMS = 0) => {
      setTimeout(() => {
        this.ajustaModal()
      }, delayMS)
    })

    window.addEventListener('resize', (event) => {
      this.ajustaModal()
    }, true)

  }

  ngOnDestroy() {
    clearInterval(this.ajustaModalTO)
  }

  ajustaModal() { // firstTime = false

    this.ngZone.runOutsideAngular(() => {

      const ionModalContent = this.element.nativeElement
      const ionPage = ionModalContent.parentElement
      const ionModal = ionPage?.parentElement

      if (!ionModal || !ionModal.className.includes('modal-adjust')) {
        clearInterval(this.ajustaModalTO)
        return
      }

      // if (firstTime) {
      // this.renderer.setStyle(ionPage, 'height', 0 + 'px')
      // }

      // ionPage.nativeElement.style.setProperty('overflow', 'hidden !important')

      let ionModalHeader = ionPage.querySelector('ion-header')
      let ionModalFooter = ionPage.querySelector('ion-footer')

      let height = 0

      if (ionModalHeader) {
        height = ionModalHeader.offsetHeight
      } else {
        ionModalHeader = null
      }
      if (ionModalFooter) {
        // height += ionModalFooter.offsetHeight - 1
        height += ionModalFooter.offsetHeight
      } else {
        ionModalFooter = null
      }

      const ionModalContentInners = ionModalContent.children

      for (const i in ionModalContentInners) {

        if (!ionModalContentInners[i].offsetHeight) {
          continue
        }

        this.renderer.setStyle(ionModalContentInners[i], 'overflow', 'hidden')

        height += ionModalContentInners[i].offsetHeight

      }

      if (ionModalHeader && height === ionModalHeader.offsetHeight) {
        // height += 100
      }

      // if (height < 200) {
      //   height = 200
      // }

      const isModalSelectLite = ionModal.classList.contains('modal-select-lite')

      if (isModalSelectLite) {

        const ionModalWrapper = ionModal.shadowRoot.querySelector('.modal-wrapper')
        // const heightWithTop = height + ionModalWrapper.offsetTop
        const heightWithTop = ionModalWrapper.offsetHeight + ionModalWrapper.offsetTop

        if (heightWithTop > window.innerHeight) {

          //ionModalWrapper.style.setProperty('top', 'auto')
          ionModalWrapper.style.setProperty('bottom', '0')
          if (ionModalWrapper.style.overflow !== 'hidden') {
            ionModalWrapper.style.setProperty('overflow', 'hidden')
          }

        }

        if (ionModalWrapper.offsetTop < 0) {

          ionModalWrapper.style.setProperty('top', '0')
          if (ionModalWrapper.style.overflow !== 'hidden') {
            ionModalWrapper.style.setProperty('overflow', 'hidden')
          }

        }

        if (!(ionModalWrapper.offsetTop < 0) && !(heightWithTop > window.innerHeight)) {
          if (ionModalWrapper.style.overflow !== 'auto') {
            ionModalWrapper.style.setProperty('overflow', 'auto')
          }
        }

      } else {

        if (height > window.innerHeight) {
          height = window.innerHeight - ((window.innerWidth > 768 && !ionPage.className.includes('centro-full')) ? 40 : 0)
        }

      }

      if (this.oldHeight !== height) {
        this.oldHeight = height
        const calcHeight = ionModal.className.includes('modal-full') ? '100%' : (height + 'px')
        this.renderer.setStyle(ionPage, 'height', calcHeight, RendererStyleFlags2.Important)
      }

      // setTimeout(() => {
      //   ionPage.nativeElement.nativeElement.style.setProperty('--overflow', 'auto !important')
      // }, 400)

    })

  }

}
