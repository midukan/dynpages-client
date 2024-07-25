import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'


import { finalize } from 'rxjs'
import { BasePage } from 'src/app/abstracts/base-page.abstract'

@Component({
	selector: 'app-otp-modal-page',
	templateUrl: './otp-modal.page.html',
	styleUrls: ['./otp-modal.page.scss'],
})
export class OTPModalPage extends BasePage {

	metodo: 'authApp' | 'email' = 'authApp'

	emailEnviado = false

	emailCountdown = 0

	token: string

	constructor(
		protected modalCtrl: ModalController,
		protected router: Router,
		public storageService: StorageService,
		public appUtil: AppUtil,
		public platform: Platform,
		protected route: ActivatedRoute,
		protected messageService: MessageService,
		public authService: AuthService,
		protected loadingCtrl: LoadingController,
		protected element: ElementRef,
	) {
		super(router, route, modalCtrl, authService, appUtil, element)
	}

	async ngOnInit() {

		this.setTitle('Autenticação', 'Realize a confirmação de 2 fatores.')

		if (this.env.name === 'development') {
			this.token = '123456'
			this.salvar()
		}

	}

	toggleMetodo() {

		this.metodo = (this.metodo === 'authApp') ? 'email' : 'authApp'

		setTimeout(() => {
			this.messageService.get('modal.resize').next(null)
		}, 300)

	}

	async sendMailCode() {

		const loading = await this.loadingCtrl.create({ message: 'Enviando...' })
		loading.present()

		this.authService.otpSendEmail()
			.pipe(finalize(() => loading.dismiss()))
			.subscribe({
				next: data => {

					this.emailEnviado = true

					this.appUtil.countdown(this, 'emailCountdown', 60).subscribe()

					setTimeout(() => {
						this.messageService.get('modal.resize').next(null)
					}, 300)

				}, error: err => this.appUtil.alertError(err)
			})
	}

	async salvar() {

		const loading = await this.loadingCtrl.create({ message: 'Validando...' })
		loading.present()

		this.authService.otpLogin({ token: this.token })
			.pipe(finalize(() => loading.dismiss()))
			.subscribe({
				next: data => {

					this.dismiss({ success: true })

				}, error: err => this.appUtil.alertError(err)
			})

	}

}
