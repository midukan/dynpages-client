import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalController } from '@ionic/angular'
import { BackendService } from 'src/app/abstracts/backend-service.abstract'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'

export interface ExtraActionButtom {
	text?: string
	color?: string
	ionIcon?: string
	click: (event: any) => void
}

@Component({
	selector: 'app-form-buttons',
	templateUrl: './form-buttons.component.html',
	styleUrls: ['./form-buttons.component.scss'],
})
export class FormButtonsComponent extends BasePage implements OnInit {

	validStart: boolean

	modalShareOpen = false

	@Input() appExtraButtons: ExtraActionButtom[]
	@Input() id: number
	@Input() service?: BackendService
	@Input() show: {
		share?: boolean,
		print?: boolean,
		prev?: boolean,
		next?: boolean,
	} = {}

	@Output() appPrint: EventEmitter<any> = new EventEmitter()

	constructor(
		protected element: ElementRef,
		public authService: AuthService,
		public appUtil: AppUtil,
		protected modalCtrl: ModalController,
		protected router: Router,
		protected route: ActivatedRoute,
		public renderer: Renderer2,
	) {

		super(router, route, modalCtrl, authService, appUtil, element)

	}

	get log() {
		return console.log
	}

	async ngOnInit() {

		await this.ngOnInitDefault()
		this.validStart = true

	}

	prevClick() {
		this.service?.entityChanger.next({ id: this.id, direction: 'PREV' })
	}

	nextClick() {
		this.service?.entityChanger.next({ id: this.id, direction: 'NEXT' })
	}

	shareClick() {
		this.modalShareOpen = true
	}

	share(where: 'copy' | 'whatsapp' | 'email') {

		const urlObj = new URL(location.href)

		urlObj.searchParams.append('openId', this.id + '')

		let filters = JSON.parse(urlObj.searchParams.get('filters') || '{}')
		filters.id = [this.id]
		urlObj.searchParams.set('filters', JSON.stringify(filters))

		const url = urlObj.toString()

		if (where === 'copy') {
			this.appUtil.copyToClipboard(url, () => this.appUtil.toast('Link copiado com sucesso.', 2000, 'success'), () => this.appUtil.alertError('Erro ao copiar link.'))
		} else if (where === 'whatsapp') {
			this.appUtil.openUrl('https://api.whatsapp.com/send?text=' + this.subtitle + ': ' + url, '_blank')
		} else if (where === 'email') {
			this.appUtil.openUrl('mailto:?subject=' + this.subtitle + '&body=' + url, '_self')
		}

		this.modalShareOpen = false

	}

}
