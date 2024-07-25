import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonPopover, ModalController } from '@ionic/angular'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'

import { TooltipContents } from './tooltip.data'

@Component({
	selector: 'app-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent extends BasePage implements OnInit {

	validStart: boolean

	contentHTML: string

	@Input() content: keyof typeof TooltipContents

	@Output() appClick: EventEmitter<any> = new EventEmitter()
	@Output() appClose: EventEmitter<any> = new EventEmitter()

	@ViewChild('infoISPPop') infoISPPop: IonPopover
	@ViewChild('infoISPPop') infoISPPopElem: ElementRef

	constructor(
		protected element: ElementRef,
		public authService: AuthService,
		public appUtil: AppUtil,
		protected modalCtrl: ModalController,
		protected router: Router,
		protected route: ActivatedRoute,
	) {

		super(router, route, modalCtrl, authService, appUtil, element)

	}

	async ngOnInit() {

		await this.ngOnInitDefault()
		this.validStart = true

		if (this.content) {
			this.contentHTML = TooltipContents[this.content]
		}

		setTimeout(() => {
			this.infoISPPop.willPresent.subscribe(() => {
				(this.infoISPPopElem as any).el.style.setProperty('--width', '350px')
			})
		})


	}

	tooltipClick(event: MouseEvent) {
		this.infoISPPop.event = event
		this.infoISPPop.present()
		this.appClick.next(null)
	}

	tooltipClose() {
		this.infoISPPop.isOpen = false
		this.appClose.next(null)
	}

}
