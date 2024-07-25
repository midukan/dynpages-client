import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[prevent-double-click]'
})
export class PreventDoubleClickDirective {

  private dbClicked: any

  @Input('prevent-double-click') preventDoubleClick: number | string

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.preventDoubleClick = this.preventDoubleClick || 1000
  }

  @HostBinding('style.pointer-events') get pEvents(): string {
    return this.dbClicked ? 'none' : 'auto'
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {

    const to = this.dbClicked = setTimeout(() => {
      if (to === this.dbClicked) {
        this.dbClicked = null
      }
    }, +this.preventDoubleClick)

  }

}
