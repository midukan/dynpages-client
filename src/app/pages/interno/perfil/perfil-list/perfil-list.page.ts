import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { ExtraActionButtom } from 'src/app/components/action-buttons/action-buttons.component'
import { BulkWarningExtraButtom } from 'src/app/components/bulk-warning/bulk-warning.component'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoUsuarioService } from 'src/app/providers/contrato-usuario.service'
import { MessageService } from 'src/app/providers/message.service'
import { PerfilService } from 'src/app/providers/perfil.service'
import { StorageService } from 'src/app/providers/storage.service'

import { SocketService } from 'src/app/providers/socket.service'
import { ContratoUsuarioPageService } from '../../contrato-usuario/contrato-usuario-page.service'
import { ImportadorModalPageService } from '../../importador/importador-page.service'
import { PerfilPageService } from '../perfil-page.service'

@Component({
	selector: 'app-perfil-list-page',
	templateUrl: './perfil-list.page.html',
	styleUrls: ['./perfil-list.page.scss'],
})
export class PerfilListPage extends ListPage {

	perfis: any;
	perfisTotal: any;

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
		protected perfilService: PerfilService,
		private alertCtrl: AlertController,
		protected perfilPageService: PerfilPageService,
		protected element: ElementRef,
		private contratoUsuarioService: ContratoUsuarioService,
		private contratoUsuarioPageService: ContratoUsuarioPageService,
		protected socketService: SocketService,
		private importadorModalPageService: ImportadorModalPageService,
	) {
		super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, perfilService, perfilPageService);
	}

	async ngOnInit() {

		await this.ngOnInitDefault('Perfis', 'perfis', 'perfil');

	}

	async beforeLoad() {

		if (this.context === 'page-list' || this.context === 'modal-list') {

			if (!this.filters.perfilTipo && this.routeData?.tipo) {
				this.filters.perfilTipo = this.routeData.tipo
			}
			else if (!this.filters.perfilTipo) {
				this.filters.perfilTipo = [this.env.enums.PerfilTipo.CLIENTE]
			}

			this.setTitle(this.env.enums.PerfilTipoStr[this.filters.perfilTipo[0]].replace('Fornecedor', 'Fornecedore') + 's')

		}

	}

	async form(perfil?: any) {

		// está fazendo assim porque não faz parte do filters então não esta no app select data
		if (!perfil) {
			perfil = { tipo: this.filters.perfilTipo[0] }
		}

		this.formDefault(perfil)

	}

	toggleAcesso(perfil: any) {

		if (perfil.usuario?.contratoUsuarios.length) {

			this.appUtil.alertMessage('Remover acesso de ' + perfil.nomeCompleto + ' neste ambiente?', {}, () => this.removerAcesso(perfil), () => { })

		} else {

			const modal = this.contratoUsuarioPageService.modalFormVinculo(perfil)

		}

	}

	async removerAcesso(perfil: any) {

		const loading = await this.loadingCtrl.create({ message: 'Salvando...' })
		loading.present()

		this.contratoUsuarioService.deleteViaPerfil(perfil.id)
			.pipe(finalize(() => {
				loading.dismiss()
			}))
			.subscribe({
				next: async data => {

					this.appUtil.toast('Acesso removido com sucesso.', 2000, 'success')

					this.perfilService.entityUpdated.next(null)
					this.contratoUsuarioService.entityUpdated.next(data.contratoUsuario)

					if (this.isModal) {
						this.modalCtrl.dismiss({
							contratoUsuario: data.contratoUsuario
						})
					}

				}, error: err => {

					this.appUtil.alertError(err)

				}
			})

	}

	async importacao(event: Event) {

		this.importadorModalPageService.modal(
			this.perfilService,
			this.env.enums.PerfilTipoStr[this.filters.perfilTipo[0]],
			['documento'],
			{ tipo: this.filters.perfilTipo[0] },
			{
				nome: 'Nome / Fantasia',
				sobrenome: 'Sobrenome / Razão',
				documento: 'Documento',
				inscricaoEstadual: 'Inscrição Estadual',
				email: 'Email',
				celular: 'Celular',
				telefone: 'Telefone',
				enderecoCEP: 'CEP',
				enderecoBairro: 'Bairro',
				enderecoLogradouro: 'Endereço',
				enderecoNumero: 'Número',
				enderecoComplemento: 'Complemento',
				enderecoCidade: 'Cidade',
				infoExtras: 'Observações',
				contato1: 'Contato 1',
				contato1Email: 'Contato 1 Email',
				contato2: 'Contato 2',
				contato2Email: 'Contato 2 Email',
				contato3: 'Contato 3',
				contato3Email: 'Contato 3 Email',
			},
			[
				['José', 'Fulano da Silva', '123.456.789-10', '123.456.789.123', 'teste@teste.com.br', '(11) 98765-4321', '', '17012-345', 'Jd. Aeroporto', 'Av. Getúlio Vargas', '3768', 'Sala 172', 'São Paulo', 'Lidiane', 'lidiane@teste.com', 'Roberval', 'roberval@teste.com', 'Fulano', 'fulano@teste.com', ''],
				['Lojas Top', 'Lojas Top Ltda.', '12.345.678/0001-90', '852.963.741.753', 'contato@lojastop.com.br', '(14) 99999-9999', '(14) 3210-9876', '', '', '', '', '', '', '', '', '', '', '', '', 'Observações do cliente aqui'],
			],
			1000
		)

	}

}
