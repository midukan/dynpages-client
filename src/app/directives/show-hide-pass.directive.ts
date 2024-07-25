import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[showHidePass]'
})
export class ShowHidePassDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {

    this.addShowHideIcon();

  }

  private addShowHideIcon(): void {
    const input = this.el.nativeElement;
    const icon = this.renderer.createElement('ion-icon');
    this.renderer.setAttribute(icon, 'name', 'eye-outline');
    this.renderer.setStyle(icon, 'position', 'absolute');
    this.renderer.setStyle(icon, 'right', '10px');
    this.renderer.setStyle(icon, 'top', '0');
    this.renderer.setStyle(icon, 'z-index', '2');
    this.renderer.setStyle(icon, 'bottom', '0');
    this.renderer.setStyle(icon, 'margin', 'auto');
    this.renderer.setStyle(icon, 'cursor', 'pointer');
    this.renderer.listen(icon, 'click', () => {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      icon.setAttribute('name', type === 'password' ? 'eye-outline' : 'eye-off-outline');
    });
    this.renderer.appendChild(input.parentElement, icon);
  }
}
