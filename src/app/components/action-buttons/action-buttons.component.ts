import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalController } from '@ionic/angular'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { ListPageContext } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'

export interface ExtraActionButtom {
	text?: string
	title?: string
	ionIcon: string
	click: (event: any) => void
}

@Component({
	selector: 'app-action-buttons',
	templateUrl: './action-buttons.component.html',
	styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent extends BasePage implements OnInit {

	validStart: boolean

	modalShareOpen = false

	@Input() parentContext: ListPageContext = 'page-list'
	@Input() appExtraButtons: ExtraActionButtom[]
	@Input() show: {
		save?: boolean,
		add?: boolean,
		bulk?: boolean,
		refresh?: boolean,
		share?: boolean,
		print?: boolean,
		report?: boolean,
	} = {}

	@Output() appRefresh: EventEmitter<any> = new EventEmitter()
	@Output() appPrint: EventEmitter<any> = new EventEmitter()
	@Output() appReport: EventEmitter<any> = new EventEmitter()
	@Output() appBulk: EventEmitter<any> = new EventEmitter()
	@Output() appAdd: EventEmitter<any> = new EventEmitter()
	@Output() appSave: EventEmitter<any> = new EventEmitter()

	@ViewChild('bulkBt') bulkBt: any

	constructor(
		protected element: ElementRef,
		public authService: AuthService,
		public appUtil: AppUtil,
		protected modalCtrl: ModalController,
		protected router: Router,
		protected route: ActivatedRoute,
		public renderer: Renderer2,
		private messageService: MessageService
	) {
		super(router, route, modalCtrl, authService, appUtil, element)

		this.messageService.get('bulk.executed').subscribe(() => {
			if (!this.bulkBt) return

			this.bulkClick(true)
		})
	}

	get log() {
		return console.log
	}

	async ngOnInit() {
		await this.ngOnInitDefault()

		this.validStart = true
	}

	shareClick() {
		this.modalShareOpen = true
	}

	share(where: 'copy' | 'whatsapp' | 'email') {
		if (where === 'copy') {
			this.appUtil.copyToClipboard(location.href, () => this.appUtil.toast('Link copiado com sucesso.', 2000, 'success'), () => this.appUtil.alertError('Erro ao copiar link.'))
		} else if (where === 'whatsapp') {
			this.appUtil.openUrl('https://api.whatsapp.com/send?text=' + document.title + ': ' + location.href, '_blank')
		} else if (where === 'email') {
			this.appUtil.openUrl('mailto:?subject=' + document.title + '&body=' + location.href, '_self')
		}
		this.modalShareOpen = false
	}

	bulkClick(forceClose = false) {
		if (this.bulkBt.el.className.includes('ion-color-danger')) {
			this.renderer.removeClass(this.bulkBt.el, 'ion-color-danger')
			this.renderer.addClass(this.bulkBt.el, 'ion-color-dark')

			this.appBulk.next(null)
		} else if (!forceClose) {
			this.renderer.addClass(this.bulkBt.el, 'ion-color-danger')
			this.renderer.removeClass(this.bulkBt.el, 'ion-color-dark')

			this.appBulk.next(null)
		}

		setTimeout(() => {
			this.messageService.get('modal.resize').next(null)
		})
	}
}
