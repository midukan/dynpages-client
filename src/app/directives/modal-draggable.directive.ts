import { AfterContentInit, Directive, ElementRef, NgZone, Renderer2 } from '@angular/core'

import { MessageService } from '../providers/message.service'

@Directive({
  selector: 'ion-content, [modal-adjust-content]'
})

export class ModalDragabbleDirective implements AfterContentInit {

  moveModal = false
  left: number
  top: number
  lastLeft: number
  lastTop: number

  constructor(public element: ElementRef, public renderer: Renderer2, private ngZone: NgZone, private messageService: MessageService) {

  }

  ngAfterContentInit() {

    this.draggableModal()

  }

  draggableModal() {

    this.ngZone.runOutsideAngular(() => {

      const ionModalContent = this.element.nativeElement
      const ionPage = ionModalContent.parentElement

      // short ifs devido a repetição de ion-page quando usa keepContentsMounted
      let ionModal = ionPage.parentElement?.className.includes('modal-draggable') ? ionPage.parentElement : ionPage.parentElement.parentElement
      ionModal = ionModal.parentElement?.className.includes('modal-draggable') ? ionModal.parentElement : ionModal
      ionModal = ionModal.parentElement?.className.includes('modal-draggable') ? ionModal.parentElement : ionModal

      if (!ionModal || ionModal.className.indexOf('modal-draggable') === -1) {
        return
      }

      let ionModalHeader: HTMLElement = ionPage.querySelector('ion-header')
      const ionModalWrapper = ionModal.shadowRoot.querySelector('.modal-wrapper')

      if (!ionModal.className.includes('modal-draggable-handler')) {

        // descomentando essa linha, modal inline perde o draggable na segunda abertura
        // ionModal.classList.add('modal-draggable-handler')

        this.renderer.setStyle(ionModalWrapper, 'position', 'absolute')

        if (ionModalHeader) {

          ionModalHeader.classList.add('cursor-move')
          setTimeout(() => {
            ionModalHeader.title = 'Clique e arreste para mover' + (ionModalHeader.querySelector('.btn-maximize') ? ' ou duplo click para maximizar' : '') + '.'
          }, 1000)

          ionModalHeader.ondblclick = event => {

            if (!ionModalHeader.querySelector('.btn-maximize')) return

            if (ionModalWrapper.style.width === '100%') {

              ionModalWrapper.style.setProperty('width', null);
              ionModalWrapper.style.setProperty('max-width', null);
              ionModalWrapper.style.setProperty('height', null);

              this.renderer.setStyle(ionModalWrapper, 'left', null)
              this.renderer.setStyle(ionModalWrapper, 'top', null)

              ionPage.classList.remove('centro-full')
              // ionModal.classList.remove('modal-full')

            } else {

              ionModalWrapper.style.setProperty('width', '100%', 'important');
              ionModalWrapper.style.setProperty('max-width', '100%', 'important');
              ionModalWrapper.style.setProperty('height', '100%', 'important');

              this.renderer.setStyle(ionModalWrapper, 'left', '0px')
              this.renderer.setStyle(ionModalWrapper, 'top', '0px')

              ionPage.classList.add('centro-full')
              // ionModal.classList.add('modal-full')

            }

            this.messageService.get('modal.resize').next(null)

          }

          ionModalHeader.onmousedown = (ionModalHeader.ontouchstart as any) = event => {

            this.moveModal = true

            this.left = ionModalWrapper.offsetLeft
            this.top = ionModalWrapper.offsetTop

            if (event.movementX === undefined) {
              this.lastLeft = event.touches[0].pageX
              this.lastTop = event.touches[0].pageY
            }

          }

          ionModal.onmousemove = (ionModalHeader.ontouchmove as any) = event => {

            if (!this.moveModal) return

            if (event.movementX !== undefined && !this.lastLeft) {

              this.left += event.movementX
              this.top += event.movementY

            } else if (event.touches) {

              const diffX = event.touches[0].pageX - this.lastLeft
              const diffY = event.touches[0].pageY - this.lastTop
              this.lastLeft = event.touches[0].pageX
              this.lastTop = event.touches[0].pageY
              this.left += diffX
              this.top += diffY

            }

            this.renderer.setStyle(ionModalWrapper, 'left', this.left + 'px')
            this.renderer.setStyle(ionModalWrapper, 'top', this.top + 'px')

          }

          ionModal.onmouseup = (ionModalHeader.ontouchend as any) = event => {
            this.moveModal = false
          }

        }

      }

    })

  }

}
