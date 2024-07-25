import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { ExtraActionButtom } from 'src/app/components/action-buttons/action-buttons.component'
import { BulkWarningExtraButtom } from 'src/app/components/bulk-warning/bulk-warning.component'
import { AuthService } from 'src/app/providers/auth.service'
import { CidadeService } from 'src/app/providers/cidade.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'

import { SocketService } from 'src/app/providers/socket.service'
import { CidadePageService } from '../cidade-page.service'

@Component({
	selector: 'app-cidade-list-page',
	templateUrl: './cidade-list.page.html',
	styleUrls: ['./cidade-list.page.scss'],
})
export class CidadeListPage extends ListPage {

	cidades: any;
	cidadesTotal: any;

	extraButtons: ExtraActionButtom[] = [
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
		private cidadeService: CidadeService,
		private alertCtrl: AlertController,
		private cidadePageService: CidadePageService,
		protected element: ElementRef,
		protected socketService: SocketService,
	) {
		super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, cidadeService, cidadePageService);
	}

	async ngOnInit() {

		await this.ngOnInitDefault('Cidades', 'cidades', 'cidade')

	}

}
