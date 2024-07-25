import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewChild
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonSearchbar, ModalController } from '@ionic/angular'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { ListPageContext } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MiscService } from 'src/app/providers/misc.service'
import { environment } from 'src/environments/environment'

import { AppDatetimeGroupTypes } from '../datetime-group/datetime-group.component'
import { AppDatetimeTypes } from '../datetime/datetime.component'
import { AppSelectTypes, selectOptions } from '../select/select.data'
import {
	IIonInputOptions,
	IIonSelectOptions,
	IonInputTypes,
	IonSelectTypes,
	appDatetimeGroupOptions,
	appDatetimeOptions,
	ionInputOptions,
	ionSelectOptions
} from './filters.data'

export interface FiltersExtraButtom {
	ionIcon: string;
	click: (event: any) => void;
}

export type FilterContext = 'tiny' | 'complete';

export type FilterTypes = AppSelectTypes | IonSelectTypes | IonInputTypes | AppDatetimeTypes | AppDatetimeGroupTypes;

export type FiltersSelectDatas = { [show: string]: { text: string; id: number; original?: any }[] }[]; // , _update?: boolean

@Component({
	selector: 'app-filters',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent extends BasePage implements OnInit, OnChanges {

	validStart: boolean;

	isMobile = false;

	context: FilterContext = 'tiny';

	ionSelectOptions = ionSelectOptions(environment);
	ionInputOptions = ionInputOptions(environment);
	appDatetimeOptions = appDatetimeOptions(environment);
	appDatetimeGroupOptions = appDatetimeGroupOptions(environment);
	appSelectOptions = selectOptions(environment);

	filters: any;
	selectDatas: FiltersSelectDatas;
	totalFilters = 0;

	// showComplete: FilterTypes[]

	@Input() parentContext: ListPageContext = 'page-list';
	@Input() showSearch: boolean = true;
	@Input() showDateGroup: AppDatetimeGroupTypes | null = 'dataGroup';
	@Input() appShow: FilterTypes[];
	@Input() appShowComplete: FilterTypes[];
	@Input() appExtraButtons: FiltersExtraButtom[];
	@Input() forceMobile: boolean = false;
	@Input() appFilters: any;
	@Output() appFiltersChange: EventEmitter<any> = new EventEmitter();

	@Input() appSelectDatas: FiltersSelectDatas = [];
	@Output() appSelectDatasChange: EventEmitter<FiltersSelectDatas> = new EventEmitter<FiltersSelectDatas>();

	@ViewChild(IonSearchbar) inputSearch: IonSearchbar;

	constructor(
		protected element: ElementRef,
		public authService: AuthService,
		public appUtil: AppUtil,
		private miscService: MiscService,
		protected modalCtrl: ModalController,
		protected router: Router,
		protected route: ActivatedRoute,
		public renderer: Renderer2,
	) {
		super(router, route, modalCtrl, authService, appUtil, element);
	}

	get log() {
		return console.log;
	}

	async ngOnInit() {

		this.isMobile = window.innerWidth < (window as any).GLOBAL_MOBILE_WIDTH

		await this.ngOnInitDefault();

		this.validStart = !!this.appFilters;

		if (this.parentContext === 'select-lite') {
			setTimeout(() => {
				this.inputSearch.setFocus();
			}, 500);
		}

		setTimeout(() => {
			this.loadSelectDatas();
		}, 500);

		// usa no filter complete
		this.setFilters()

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.appFilters?.currentValue) {
			this.setFilters();
		}
	}

	async ionViewDidEnter() {
		this.isModal = !!(await this.modalCtrl.getTop());
	}

	getIonSelectData(type: FilterTypes): IIonSelectOptions {
		return this.ionSelectOptions.find((iso) => iso.type === type) || ({ label: 'Select não encontrado', options: [] } as any);
	}

	getIonInputData(type: FilterTypes): IIonInputOptions {
		return this.ionInputOptions.find((iso) => iso.type === type) || ({ label: 'Input não encontrado' } as any);
	}

	getAppDatetimeData(type: FilterTypes) {
		return this.appDatetimeOptions.find((adt) => adt.type === type) || { label: 'Datetime não encontrado', withTime: true };
	}

	getAppDatetimeGroupData(type: FilterTypes) {
		return this.appDatetimeGroupOptions.find((adt) => adt.type === type) || { withTime: true };
	}

	setFilters() {

		// desta forma, mantém os selectDatas iniciais
		this.appUtil.clearObj(this.filters) // limpando pois campos removidos como posStatus continuavam aqui ainda
		this.filters = { ...this.filters, ...this.appUtil.deepCopy(this.appFilters) };

		this.testApplyMobile()

		// console.log('aaaa', this.filters)

		this.selectDatas = { ...this.selectDatas, ...this.appUtil.deepCopy(this.appSelectDatas) };

		this.setTotalFilters()

	}

	private testApplyMobile() {

		if (this.context === 'tiny' && this.isMobile) {
			this.appShowComplete = this.appUtil.deepCopy(this.appShow)
		}

	}

	async loadSelectDatas() {
		// Vem 2 ngChanges e somente o segundo está com os dados para serem requisitados
		if (!this.totalFilters) return; //  || this.parentContext === 'select-lite'

		const clearedFilters = this.appUtil.deepCopy(this.getClearedFilters());

		delete clearedFilters.pager;
		delete clearedFilters.order;

		let found = false;

		Object.entries(clearedFilters).forEach((cf) => {
			if (this.appShow?.includes(cf[0] as FilterTypes)) {
				found = true;
			}
		});

		if (!found) {
			return;
		}

		this.miscService.getSelectDatas(clearedFilters).subscribe({
			next: (data) => {
				Object.entries(data).forEach((kv) => {
					this.selectDatas[kv[0]] = kv[1];

					// if (this.selectDatas[kv[0]]) {
					//   this.selectDatas[kv[0]]._update = true
					// }
				});

				this.appSelectDatasChange.next(this.selectDatas);
			},
			error: (err) => this.appUtil.alertError(err),
		});
	}

	async applyFilters() {
		this.modalCtrl.dismiss(this.appUtil.deepCopy(this.filters));
	}

	async clearFilters() {
		this.appUtil.clearObj(this.filters, ['pager']);
	}

	async filtersModal() {
		const modal = await this.modalCtrl.create({
			component: FiltersComponent,
			componentProps: { context: 'complete', appFilters: this.filters, appShow: this.appShowComplete },
			cssClass: 'modal-draggable modal-medium__ modal-adjust',
			enterAnimation: this.appUtil.enterAnimation('grow'),
			leaveAnimation: this.appUtil.leaveAnimation('grow'),
		});

		modal.onDidDismiss().then((data) => {
			if (!data.role) {
				// this.filters = {...this.filters, ...data.data}
				this.filters = data.data;

				this.setChangeFilters();
			}
		});

		modal.present();
	}

	searchChanged() {
		// console.log('searchChanged');

		setTimeout(() => {
			this.inputSearch.setFocus();
		}, 600); // ms req

		this.setChangeFilters();
	}

	setChangeFilters(show?: FilterTypes) {

		setTimeout(() => {

			if (show === 'dataGroup') {
				this.setChangeFilters('dataInicial');
				this.setChangeFilters('dataFinal');
				return;
			}
			if (show === 'datahoraGroup') {
				this.setChangeFilters('datahoraInicial');
				this.setChangeFilters('datahoraFinal');
				return;
			}

			this.filters.pager.offset = 0;

			if (show) {
				if ((!this.filters[show] || (this.filters[show] instanceof Array ? !this.filters[show].length : !this.filters[show])) && typeof this.filters[show] !== 'boolean') {
					this.filters[show] = undefined;
				}
			}

			if (show === 'dataFinal' && this.filters[show]) {
				const dataFinal = new Date(this.filters[show]);
				if (dataFinal.getHours() !== 23) {
					dataFinal.setDate(dataFinal.getDate() + 1);
					dataFinal.setMilliseconds(dataFinal.getMilliseconds() - 1);
					this.filters[show] = dataFinal.toJSON();
				}
			}

			this.setTotalFilters();

			if (show) {
				if (this.showSubtype(show) === 'ion-select') {
					if (this.getIonSelectData(show).multiple) {
						this.selectDatas[show] = this.filters[show]?.map((f) => ({ id: f, text: '' }));
					} else {
						this.selectDatas[show] = this.filters[show];
					}
				}
			}

			this.appSelectDatasChange.next(this.selectDatas);

			const clearedFilters = this.getClearedFilters();

			// se for modal (filtro completo ou quem abriu for um select)
			if (
				this.context === 'complete' ||
				this.parentContext === 'select-lite' ||
				this.parentContext === 'select-full' ||
				this.parentContext === 'modal-list'
			) {
				this.appFiltersChange.next(clearedFilters);
				return;
			}

			const currentUrlTree = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { filters: JSON.stringify(clearedFilters) }, queryParamsHandling: 'merge' })
			this.router.navigateByUrl(currentUrlTree)

		})

	}

	getClearedFilters() {
		const clearedFilters = this.appUtil.deepCopy(this.filters);

		Object.entries(clearedFilters).forEach((keyVal) => {
			if (keyVal[0].charAt(0) === '_') {
				delete clearedFilters[keyVal[0]];
			}
		});

		return clearedFilters;
	}

	setTotalFilters() {
		const clearedFilters = this.getClearedFilters();

		this.totalFilters = Object.entries(clearedFilters).filter((a) => a[1] && a[0] !== 'pager' && a[0] !== 'order').length;
	}

	showSubtype(show: FilterTypes) {

		if (this.ionSelectOptions.some((iso) => iso.type === show)) return 'ion-select';

		if (this.ionInputOptions.some((iso) => iso.type === show)) return 'ion-input';

		if (this.appDatetimeOptions.some((iso) => iso.type === show)) return 'app-datetime';

		if (this.appDatetimeGroupOptions.some((iso) => iso.type === show)) return 'app-datetime-group';

		if (this.appSelectOptions.some((iso) => iso.type === show)) return 'app-select';

	}

	async closeModalTop() {
		(await this.modalCtrl.getTop())?.dismiss();
	}

	dismiss() {
		this.modalCtrl.dismiss(null, 'close');
	}
}
