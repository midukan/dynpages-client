import { Component, EventEmitter, HostBinding, Input, Output, SimpleChanges } from '@angular/core'
import { ModalController, ModalOptions } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { DataService } from 'src/app/providers/data.service'
import { environment } from 'src/environments/environment'

import { FilterTypes } from '../filters/filters.component'
import { TooltipContents } from '../tooltip/tooltip.data'
import { selectOptions } from './select.data'

export interface ISelectData {
	text: string
	id: number | null | undefined
	original?: any
	// _update?: boolean
}

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
})
export class SelectComponent {

	usuarioLogado: any

	isModal = false
	validStart: boolean

	selectOptions = selectOptions(environment)
	selectOption: any

	selectDataInternal: ISelectData | ISelectData[]

	content: keyof typeof TooltipContents

	@Input() type: FilterTypes
	@Input() layout: 'filter' | 'form' = 'form'
	@Input() disableFull = false
	@Input() multiple: number
	@Input() color: string
	@Input() label: string
	@Input() placeholder = 'Selecione'
	@Input() opcaoNenhum = true
	@Input() required = false
	@Input() opcaoCadastrar = true
	@Input() showId = true
	@Input() disabled = false
	@Input() registros: any[]
	@Input() filters: any
	@Input() tooltip: keyof typeof TooltipContents | string
	@HostBinding('class.force-mobile') @Input() forceMobile: boolean = false

	@Input() ngModel: number | number[] | null
	@Output() ngModelChange: EventEmitter<number | number[] | null> = new EventEmitter<number | number[] | null>()

	@Input() initSelectData: ISelectData | ISelectData[]
	@Input() selectData: ISelectData | ISelectData[] | null
	@Output() selectDataChange: EventEmitter<ISelectData | ISelectData[] | null> = new EventEmitter<ISelectData | ISelectData[] | null>()

	@Output() appDidDismiss: EventEmitter<string | undefined> = new EventEmitter<string | undefined>()

	constructor(public authService: AuthService, public appUtil: AppUtil, private modalCtrl: ModalController, private dataService: DataService) {
		this.usuarioLogado = this.authService.getAuth()
	}

	get log() {
		return console.log
	}

	ngOnInit() {

		this.validStart = !!this.type || !!this.ngModel

		this.selectOption = this.selectOptions.find((sd) => sd.type === this.type)

		if (!this.label) {
			this.label = this.selectOption.label
		}

		this.selectDataInternal = this.appUtil.deepCopy(this.initSelectData)

		if (this.isContent()) {
			this.content = this.tooltip as keyof typeof TooltipContents
		}

	}

	async ionViewDidEnter() {
		this.isModal = !!(await this.modalCtrl.getTop())
	}

	ngOnChanges(changes: SimpleChanges) {

		// Necessário para atualizar após load da req. de selectDatas
		if (changes.selectData) {
			// setTimeout usado para que sempre o ngOnChanges ocorra depois do ngOninit
			setTimeout(() => {
				this.selectDataInternal = this.appUtil.deepCopy(changes.selectData.currentValue)
			})
		}
		// if (changes.filters) {
		// 	this.filters = changes.filters
		// }

	}

	async viewModal(event?: any) {

		if (!this.selectOption.modalViewOptions) {
			return
		}

		let modalOptions: ModalOptions = { ...this.selectOption.modalViewOptions }

		modalOptions.componentProps = { appSelect: this, ...(modalOptions.componentProps || {}) }
		modalOptions.componentProps.state = modalOptions.componentProps.state || {}
		modalOptions.componentProps.state.selectData = this.appUtil.deepCopy(this.selectDataInternal)

		modalOptions.cssClass = (modalOptions.cssClass || '') + ' modal-adjust '

		if (this.registros) {
			modalOptions.componentProps.state.registros = this.registros
		}

		modalOptions.enterAnimation = this.appUtil.enterAnimation('grow')
		modalOptions.leaveAnimation = this.appUtil.leaveAnimation('grow')

		const modal = await this.modalCtrl.create(modalOptions)

		modal.present()

	}

	async selectModal(type: 'lite' | 'full' = 'lite', event?: any) {

		if (this.disabled) {
			return
		}

		let modalOptions: ModalOptions = { ...this.selectOption.modalOptions }

		// modalOptions.showBackdrop = type !== 'lite' || window.innerWidth < 1200

		modalOptions.componentProps = {
			appSelect: this,
			filtersMultiple: this.multiple,
			context: 'select-' + type,
			opcaoNenhum: this.opcaoNenhum,
			opcaoCadastrar: this.opcaoCadastrar,
			...(modalOptions.componentProps || {}),
		}
		modalOptions.cssClass = (modalOptions.cssClass || '') + ' modal-adjust opacity-0 ' + ('modal-select-' + type)

		modalOptions.componentProps.state = modalOptions.componentProps.state || {}
		modalOptions.componentProps.state.selectData = this.appUtil.deepCopy(this.selectDataInternal)

		if (this.registros) {
			modalOptions.componentProps.state.registros = this.registros
		}

		if (this.filters) {
			modalOptions.componentProps.state.filters = {
				// ...modalOptions.componentProps.state,
				...modalOptions.componentProps.state.filters,
				...this.filters
			}
		}

		modalOptions.enterAnimation = this.appUtil.enterAnimation('grow', type === 'lite' ? 100 : 300)
		modalOptions.leaveAnimation = this.appUtil.leaveAnimation('grow', type === 'lite' ? 100 : 300)

		const modal = await this.modalCtrl.create(modalOptions)

		modal.onDidDismiss().then((data) => {

			if (!data.role && data.data) {

				// if (data.data.selectData) {
				//   data.data.selectData._update = true
				// }
				// this.selectData = data.data.selectData

				// this.selectDataInternal = this.appUtil.deepCopy(data.data.selectData)

				if (this.multiple) {
					if (data.data.selectData) {
						const selectDataInternal: ISelectData[] = (this.selectDataInternal as ISelectData[]) || []
						selectDataInternal.push(data.data.selectData)
					} else {
						this.reset()
					}
				} else {
					this.selectDataInternal = data.data.selectData
				}

				this.ngModelChange.next(this.multiple ? (this.selectDataInternal as any).map((sd) => sd.id) || null : data.data.selectData?.id || null)
				this.selectDataChange.next(this.selectDataInternal)

			}

			this.appDidDismiss.next(data.role)

		})

		modal.present()

		let modalDone = false
		const modalDoneInterval = setInterval(async () => {

			const ionModal = await this.modalCtrl.getTop()

			if (!ionModal?.classList.contains('opacity-0')) {
				return
			}
			// remove blink
			ionModal?.classList.remove('opacity-0')

			// if (type === 'full' || window.innerWidth < 1200) {
			if (type === 'full') {
				clearInterval(modalDoneInterval)
				return
			}

			if (!event) {
				clearInterval(modalDoneInterval)
				return
			}

			let ionItem = event.srcElement

			// fix bug chrome
			ionItem = ionItem.tagName === 'ION-ITEM' ? ionItem : ionItem.offsetParent
			ionItem = ionItem.tagName === 'ION-ITEM' ? ionItem : ionItem.offsetParent
			ionItem = ionItem.tagName === 'ION-ITEM' ? ionItem : ionItem.offsetParent

			if (!ionModal) {
				return
			}

			modalDone = true

			const ionModalWrapper = ionModal.shadowRoot?.querySelector('.modal-wrapper') as any

			const { left, top, width, height } = ionItem.getBoundingClientRect()

			// ionModalWrapper.style.setProperty('left', (event.pageX - event.layerX - (event.srcElement.tagName === 'ION-ITEM' ? 0 : 16)) + 'px');
			// ionModalWrapper.style.setProperty('top', (event.pageY + ionItem.offsetHeight - event.layerY) + 'px');

			const minHeight = 300
			const minWidth = 350

			if (top > window.innerHeight - minHeight) {
				ionModalWrapper.style.setProperty('min-height', minHeight + 'px')
			}

			if (window.innerWidth <= (window as any).GLOBAL_MOBILE_WIDTH) {
				ionModalWrapper.style.setProperty('top', '40px')
				ionModalWrapper.style.setProperty('left', 0)
				ionModalWrapper.style.setProperty('width', '100%')
			} else {
				ionModalWrapper.style.setProperty('top', Math.min(top, window.innerHeight - minHeight) + 'px')
				ionModalWrapper.style.setProperty('left', left + 'px')
				ionModalWrapper.style.setProperty('width', Math.max(ionItem.offsetWidth, minWidth) + 'px')
			}

			// console.log(event, ionItem)

			if (modalDone) {
				clearInterval(modalDoneInterval)
			}

		}, 50)

	}

	reset() {

		const selectData: any[] | any = this.multiple ? [] : { text: 'Selecione', id: null }

		this.selectDataInternal = this.appUtil.deepCopy(selectData)
		this.selectData = this.appUtil.deepCopy(selectData)

		this.ngModelChange.next(null)
		this.selectDataChange.next(selectData)

		this.ngOnInit()

	}

	addFilterItem(selectData: ISelectData | null) {

		let selectDataInternal: ISelectData[] | null = (this.selectDataInternal as ISelectData[]) || []

		if (selectData) {
			if (selectDataInternal.some((sd) => sd.id === selectData.id)) {
				return
			}
			selectDataInternal.push(selectData)
		} else {
			selectDataInternal = null
		}

		this.ngModelChange.next(selectDataInternal?.map((sd) => sd.id!) || null)
		this.selectDataChange.next(selectDataInternal)

	}

	removeFilterItem(id: number) {

		let selectDataInternal: ISelectData[] | null = this.selectDataInternal as ISelectData[]

		const idx = selectDataInternal.findIndex((sd) => sd.id === id)

		if (idx >= 0) {

			selectDataInternal?.splice(selectDataInternal.findIndex((sd) => sd.id === id), 1)

			if (!selectDataInternal.length) {
				selectDataInternal = null
			}

			this.ngModelChange.next(selectDataInternal?.map((sd) => sd.id!) || null)
			this.selectDataChange.next(selectDataInternal)

		}

	}

	isAppSelectFilled(): boolean {
		return (this.selectDataInternal as any)?.id || (this.selectDataInternal as any)?.length
	}

	totalAppSelectFilled(): boolean {
		return (this.selectDataInternal as any)?.id || (this.selectDataInternal instanceof Array && this.selectDataInternal.length === 1)
	}

	textContent(): string {

		if (this.multiple) {
			const texts = ((this.selectDataInternal as any) || []).map((sd) => sd.text)

			if (texts.length) {
				return texts.length > 1 ? texts.length + ' selecionados' : texts[0]
			} else {
				return this.placeholder
			}
		} else {
			// console.log(this.selectDataInternal)

			return (this.selectDataInternal as any)?.text || this.placeholder
		}

	}

	idContent(): number | null {

		if (!this.multiple) {
			return (this.selectDataInternal as any)?.id
		}

		return null

	}

	isContent() {

		return (typeof this.tooltip !== 'string')

	}

}
