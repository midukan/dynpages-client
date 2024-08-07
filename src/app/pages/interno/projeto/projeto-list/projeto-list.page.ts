import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { ExtraActionButtom } from 'src/app/components/action-buttons/action-buttons.component'
import { BulkWarningExtraButtom } from 'src/app/components/bulk-warning/bulk-warning.component'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { ProjetoService } from 'src/app/providers/projeto.service'
import { StorageService } from 'src/app/providers/storage.service'

import { SocketService } from 'src/app/providers/socket.service'
import { ContratoPageService } from '../../contrato/contrato-page.service'
import { ImportadorModalPageService } from '../../importador/importador-page.service'
import { PerfilPageService } from '../../perfil/perfil-page.service'
import { ProjetoPageService } from '../projeto-page.service'

@Component({
	selector: 'app-projeto-list-page',
	templateUrl: './projeto-list.page.html',
	styleUrls: ['./projeto-list.page.scss'],
})
export class ProjetoListPage extends ListPage {
	projetos: any;
	projetosTotal: any;

	extraButtons: ExtraActionButtom[] = [
		{
			text: 'Importar',
			title: 'Importa registros via arquivo CSV (Excel)',
			ionIcon: 'cloud-upload',
			click: (event) => this.importacao(event),
		},
		{
			text: 'Exportar',
			title: 'Exporta os dados exibidos em CSV (Excel)',
			ionIcon: 'cloud-download',
			click: (event) => this.exportacao(event),
		},
	];

	bulkExtraButtons: BulkWarningExtraButtom[] = [];

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
		private projetoService: ProjetoService,
		private alertCtrl: AlertController,
		private projetoPageService: ProjetoPageService,
		protected element: ElementRef,
		protected socketService: SocketService,
		private importadorModalPageService: ImportadorModalPageService,
		public contratoPageService: ContratoPageService,
		public perfilPageService: PerfilPageService,
	) {
		super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, projetoService, projetoPageService);
	}

	async ngOnInit() {

		await this.ngOnInitDefault('Projetos', 'projetos', 'projeto')

	}

	async importacao(event: Event) {

		this.importadorModalPageService.modal(
			this.projetoService,
			'Projeto',
			['contratoControleId', 'uuid', 'dataBloqueio', 'bloqueioParcialDias', 'bloqueioTotalDias'],
			{},
			{
				contratoControleId: 'ContratoId',
				uuid: 'UUID',
				dataBloqueio: 'Data de Bloqueio',
				bloqueioParcialDias: 'Dias p/ bloqueio parcial',
				bloqueioTotalDias: 'Dias p/ bloqueio total',
			},
			[
				[1, 'sd64dsf-sdrwsdg6d-sddg1s-ggfgs66gs5g', '2024-05-21', 14, 30],
			],
			1000
		)

	}

}
