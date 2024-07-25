import { AfterContentInit, Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core'

@Directive({
  selector: '[display-errors]'
})

export class InputDisplayErrorsDirective implements AfterContentInit {

  @Input('display-errors') displayErrors: { property: string, errors: { property: string, value: string }[] }

  constructor(public element: ElementRef, public renderer: Renderer2) {

  }

  ngAfterContentInit() {



  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.displayErrors && changes.displayErrors.currentValue) {

      document.getElementsByTagName('body')[0].querySelectorAll('.app-badge-error').forEach(badge => badge.parentNode?.removeChild(badge))

      setTimeout(() => {

        if (!(changes.displayErrors.currentValue.errors instanceof Array)) {
          return
        }

        const errorObjs = changes.displayErrors.currentValue.errors.filter(erro => erro.property === this.displayErrors.property)

        if (errorObjs?.length) {

          errorObjs.slice(0, 1).forEach(erro => {

            this.renderBadge(erro)

          })

        }

      })

    }

  }

  renderBadge(erro: any) {

    const container = this.element.nativeElement

    this.renderer.addClass(container, 'position-relative')
    this.renderer.addClass(container, 'overflow-visible')

    const ionBadge = this.renderer.createElement('div')
    'app-badge-error position-absolute bottom-0 z-index-3 margin-bottom-5-n border-radius-6 color-danger-shade font-size-9 text-right'.split(' ').forEach(cls => this.renderer.addClass(ionBadge, cls))
    this.renderer.setStyle(ionBadge, 'padding', '1px 5px 1px 5px')
    this.renderer.setStyle(ionBadge, 'right', '0px')
    this.renderer.setStyle(ionBadge, 'bottom', '-2px')
    this.renderer.setStyle(ionBadge, 'border', ' 1px solid #aeaeae')
    this.renderer.setStyle(ionBadge, 'background-color', '#fff5f5')
    this.renderer.setStyle(ionBadge, 'overflow', 'hidden')
    this.renderer.setStyle(ionBadge, 'max-height', '15px')
    // this.renderer.setStyle(ionBadge, 'border', '1px solid var(--ion-color-danger)') // Ficou mais bonito sem

    const ionBadgeInner = this.renderer.createText(erro.text)
    this.renderer.appendChild(ionBadge, ionBadgeInner)

    this.renderer.appendChild(container, ionBadge)

  }

}
