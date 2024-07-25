import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'

import { parse, unparse } from 'papaparse'
import { finalize } from 'rxjs'
import { BackendService, IBodyFile } from 'src/app/abstracts/backend-service.abstract'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { IUploadSelectResult } from 'src/app/util'

@Component({
	selector: 'app-importador-modal-page',
	templateUrl: './importador-modal.page.html',
	styleUrls: ['./importador-modal.page.scss'],
})
export class ImportadorModalPage extends BasePage {

	etapa: 1 | 2 = 1

	fileData: IUploadSelectResult | undefined

	fieldsArr: [string, string][] = []

	camposOrdem: (string | null)[] = []

	registros: any[] | undefined
	colunasDetectadas = 0

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

		this.setTitle('Importação', 'Facilita a inclusão dos registros em planilha.')

		this.fieldsArr = Object.entries(this.state.fields)
		this.camposOrdem = this.fieldsArr.map(f => f[0])

	}

	getUniqueNames() {

		return this.state.uniqueFields.map(u => this.state.fields[u]).join(' ou ')

	}

	async selecionarPlanilha() {

		let fileDataArr: void | IUploadSelectResult[] = await this.appUtil.uploadSelect(undefined, 'data', '.csv').catch((err) => this.appUtil.alertError(err));
		if (!fileDataArr?.length) return

		const fileData = fileDataArr.pop()
		this.fileData = fileData!

		let buffer = Uint8Array.from(atob(this.fileData.base64.split(',')[1]), c => c.charCodeAt(0));
		let csvString = new TextDecoder().decode(buffer);

		const data = parse(csvString, {
			delimiter: ';'
		})

		if (!data || data.errors?.length) {
			this.appUtil.alertError('Falha na formatação do arquivo CSV. Verifique se ele está dentro do padrão fornecido para download. (' + data.errors.join(', ') + ')')
			return
		}

		this.registros = data.data

		// this.registros = csvString.split(this.linha).filter(l => l.trim()).map(l => l.split(this.div))

		this.registros.forEach(r => {
			this.colunasDetectadas = Math.max(this.colunasDetectadas, r.length)
		})

		for (let i = 0; i < Math.max(this.colunasDetectadas, this.camposOrdem.length); i++) {
			if (Math.min(this.colunasDetectadas, this.camposOrdem.length) > i) continue
			this.camposOrdem[i] = null
		}

		if (this.registros.length > this.state.limiteRegistros) {
			this.appUtil.alertError('Esta planilha tem mais de ' + this.state.limiteRegistros + ' registros. Ajuste para que não atinja o limite por importação.')
			this.fileData = undefined
		}

	}

	async enviar() {

		if (!this.fileData || !this.registros?.length) return

		if (this.hasDuplicatedOrdem()) {
			this.appUtil.alertError('Existem colunas com atribuições de campos repetidos.')
			return
		}

		const datas = this.state.forceData ? Object.entries(this.state.forceData).map(f => f[1]) : []

		let registros = this.appUtil.deepCopy(this.registros)
		const posicoes = this.fieldsArr.map(f => f[0]).map(key => this.camposOrdem.indexOf(key))
		registros = registros.map(registro => posicoes.map(index => registro[index]))

		registros.forEach(r => r.push(...datas))

		const csvString = unparse(registros, {
			delimiter: ';'
		})

		if (!csvString) {
			this.appUtil.alertError('Falha na geração do CSV para envio.')
			return
		}

		const base64 = this.appUtil.base64.encode("\uFEFF" + csvString)

		const loading = await this.loadingCtrl.create({ message: 'Enviando...' });
		loading.present();

		const service: BackendService = this.state.service

		service
			.uploadImportacao!({ file: { dataNome: this.fileData.name, dataUpload: base64 } })
			.pipe(finalize(() => loading.dismiss()))
			.subscribe({
				next: (data) => {

					this.appUtil.toast(
						'Importação concluída. Importados: ' + data.success + '. Ignorados: ' + data.skiped,
						10000, 'success'
					);

					this.resetEtapas()

					this.state.service.entityUpdated.next(data.perfil)

				},
				error: (err) => this.appUtil.alertError(err),
			});

	}

	baixarMolde() {

		const csvString = unparse(this.state.dataExample, {
			delimiter: ';'
		})

		if (!csvString) {
			this.appUtil.alertError('Falha na geração do CSV modelo.')
			return
		}

		const base64 = this.appUtil.base64.encode("\uFEFF" + csvString)

		const file: IBodyFile = {
			data: base64,
			mimetype: 'text/csv',
			filename: 'Molde para importação - ' + this.state.title + '.csv',
		}

		this.appUtil.openFileWindow(file, true)
		this.appUtil.toast('Molde gerado com sucesso.', 3000, 'success');

	}

	proximaEtapa() {

		if (this.etapa === 2) {
			this.enviar()
		}

		if (this.etapa === 1) this.etapa = 2

		setTimeout(() => this.messageService.get('modal.resize').next(null))

	}

	voltarEtapa() {

		if (this.etapa === 2) this.etapa = 1

		setTimeout(() => this.messageService.get('modal.resize').next(null))

	}

	resetEtapas() {

		this.etapa = 1
		this.registros = []
		this.colunasDetectadas = 0
		this.fileData = undefined
		this.camposOrdem = []

	}

	hasDuplicatedOrdem(keyTest?: string | null): boolean {

		const occurrences: { [key: string]: boolean } = {}

		for (const str of this.camposOrdem) {
			if (str === null || (keyTest && str !== keyTest)) continue
			if (occurrences[str]) {
				return true
			}
			occurrences[str] = true
		}

		return false

	}

}
