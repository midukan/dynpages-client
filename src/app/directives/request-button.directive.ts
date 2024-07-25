import {Directive, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
    selector: '[appReqClick]'
})

export class RequestButtonDirective implements OnInit {

    iconElement: any;
    oldIconClass: string;

    @Output() appReqClick: EventEmitter<any> = new EventEmitter();  // click somente se não estiver this._requesting

    @HostListener('click', ['$event']) hlClick(e) {
        this._onClick(e);
    }

    constructor(public element: ElementRef, public renderer: Renderer2) {


    }

    ngOnInit() {

        this.renderer.addClass(this.element.nativeElement, 'request-button');

    }

    public _onClick(event) {

        this.iconElement = this.element.nativeElement.querySelectorAll('span[class*=app-icon-]')[0];
        // this.iconElement = this.iconElement || this.element.nativeElement.querySelectorAll('ion-icon')[0];

        // impede que seja feita requisição enquanto outra está pendente
        if (this.element.nativeElement.className.indexOf('request-button-requesting') === -1) {

            this.renderer.addClass(this.element.nativeElement, 'request-button-requesting');

            if (this.iconElement) {
                this.oldIconClass = this.iconElement.className;
                this.renderer.addClass(this.iconElement, 'app-icon-spinner');
                this.renderer.addClass(this.iconElement, 'animate-spin-fast');
                // this.renderer.setStyle(this.iconElement, 'visibility', 'visible');
                // da pra usar o Renderer2 para add class
            }

            this.appReqClick.emit(this);

        }

    }

    cancelLoader() {

        if (this.iconElement) {
            this.iconElement.className = this.oldIconClass;
        }
        this.renderer.removeClass(this.element.nativeElement, 'request-button-requesting');

    }

}
