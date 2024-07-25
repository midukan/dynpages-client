import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonContent, LoadingController, ModalController } from '@ionic/angular'
import { Subscription, finalize, firstValueFrom } from 'rxjs'

import html2canvas from 'html2canvas'
import * as printJS from 'print-js'
import { AppUtil } from '../app-util'
import { FiltersSelectDatas } from '../components/filters/filters.component'
import { SelectComponent } from '../components/select/select.component'
import { AuthService } from '../providers/auth.service'
import { SocketService } from '../providers/socket.service'
import { BackendService, IBasicBodyData } from './backend-service.abstract'
import { BasePage } from './base-page.abstract'
import { PageService } from './page-service.abstract'

@Component({
  template: ''
})
export abstract class FormPage extends BasePage {

  filtersSelectDatas: FiltersSelectDatas

  key: string
  // service: BackendService

  errors: any

  appSelect: SelectComponent // vem quando abre via viewModal

  entityUpdateSub: Subscription

  @Output() appSave: EventEmitter<any> = new EventEmitter

  @ViewChild(IonContent, { static: false }) content: IonContent

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected modalCtrl: ModalController,
    protected loadingCtrl: LoadingController,
    protected authService: AuthService,
    protected appUtil: AppUtil,
    protected element: ElementRef,
    protected socketService: SocketService,
    protected service: BackendService,
    protected pageService: PageService,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

  }

  abstract ngOnInit()

  async ngOnInitDefault(title?: string, key?: string): Promise<void> {

    if (!title || !key) {
      console.error('Falta "title" ou "key" no ngOnInitDefault da FormPage.')
      return
    }

    super.ngOnInitDefault()

    // this.service = service!
    this.key = key

    this.entityUpdateSub?.unsubscribe()
    this.entityUpdateSub = this.service.entityFormUpdate.subscribe(entity => {
      this.state[this.key] = entity
      this.ngOnInit()
    })

    // Faz um load padrão no form
    if (this.state.selectData && this.service) {

      const selectData = this.state.selectData[0] ? this.state.selectData[0] : this.state.selectData

      if (selectData.id) {

        const loading = await this.loadingCtrl.create({ message: 'Carregando...' })
        loading.present()
        const data = await firstValueFrom(this.service.getMany({ id: [selectData.id], pager: { limit: 1 } }))
          .catch(err => this.appUtil.pageRequestError(err, 'alert'))
        loading.dismiss()

        if (data) {
          const dataArr = Object.entries(data)
          if (dataArr[0]) {
            this.state[key] = dataArr[0][1][0]
          }
        }

      }

    }

    let subtitle: string

    if (this.state[key]?.id) { // se for edição

      this[key] = this.appUtil.deepCopy(this.state[key])

      let idHTML: any = '<span class="badge-id-small">' + this.state[key].id + '</span>'

      if (this.state[key].nomeCompleto) {
        subtitle = idHTML + this.state[key].nomeCompleto + ''
      } else if (this.state[key].nome) {
        subtitle = idHTML + this.state[key].nome + ''
      } else if (this.state[key].descricao) {
        subtitle = idHTML + this.state[key].descricao + ''
      } else if (this.state[key].id) {
        subtitle = 'Alterando ID ' + idHTML + ''
      } else {
        subtitle = 'Alterando registro.'
      }

    } else { // se for inclusão

      // para inicializar os padrões que bem do botão de adicionar
      Object.assign(this[key + 'Default'], this.appUtil.deepCopy(this.state[key]) || {})
      this[key] = this.appUtil.deepCopy(this[key + 'Default'])

      subtitle = 'Adicionando um novo registro.'

    }

    if (this.state.filtersSelectDatas && !this[key]?.id) {
      this.filtersSelectDatas = this.appUtil.deepCopy(this.state.filtersSelectDatas)
      this.setFiltersSelectData()
    }

    this.setTitle(title, subtitle)

    await this.afterInit()

  }

  ionViewDidEnter() {
    this.ionViewDidEnterDefault()
  }

  async ionViewDidEnterDefault() {
    super.ionViewDidEnterDefault()
  }

  ngOnDestroy() {
    this.ngOnDestroyDefault()
  }

  ngOnDestroyDefault() {
    super.ngOnDestroyDefault()
  }

  abstract setFiltersSelectData()

  async afterInit() { }

  async beforeSave(): Promise<boolean | void> { }

  async afterSave(data?: IBasicBodyData) { }

  async salvar(closeModal = true, silent = false): Promise<IBasicBodyData | void> {

    const result = await this.beforeSave()

    if (result === false) return

    return await this.salvarDefault(closeModal, silent)

  }

  async salvarDefault(closeModal = true, silent = false): Promise<IBasicBodyData | void> {

    return new Promise(async (resolve, reject) => {

      const loading = await this.loadingCtrl.create({ message: 'Salvando...' })
      if (!silent) loading.present()

      this.service.save({ [this.key]: this[this.key] })
        .pipe(finalize(() => {
          loading.dismiss()
        }))
        .subscribe({
          next: async data => {

            if (!silent) this.appUtil.toast(this[this.key].id ? 'Alterado com sucesso.' : 'Criado com sucesso.', this[this.key].id ? 2000 : 2000, 'success')

            this.service.entityUpdated.next(data[this.key])

            if (data?.message) { // Usado para soft errors
              this.appUtil.alertError(data?.message)
            } else {
              if (this.isModal && closeModal) {
                this.dismiss({
                  [this.key]: data[this.key]
                })
              } else {
                this.appSave.next(data[this.key])
              }
            }

            this.afterSave(data)

            resolve(data)

          }, error: err => {

            if (typeof err.message === 'string') this.appUtil.alertError(err)
            else if (err.message instanceof Array) this.errors = err.message

            reject(err)

          }
        })

    })

  }

  async print(event: any) {

    if (!event) return

    const loading = await this.loadingCtrl.create({ message: 'Gerando...' })
    await loading.present()

    let element = event.srcElement

    let limit = 15

    while (1) {

      if (!element?.parentElement) {
        break
      }

      element = element.parentElement

      if (element.classList.contains('form-default') || element.classList.contains('printable-content')) {
        break
      }

      if (!--limit) {
        console.error('Falha ao localizar .form-default.')
        element = null
        loading.dismiss()
        break
      }

    }

    if (element) {

      let blockToPrint = element.querySelectorAll('.form-default-body, .printable-content-body')
      blockToPrint = blockToPrint[blockToPrint.length - 1]

      if (window.innerWidth <= (window as any).GLOBAL_MOBILE_WIDTH) blockToPrint.style.width = '1330px'

      const isDarkMode = document.getElementsByTagName('html')[0].classList.contains('dark-mode')
      if (isDarkMode) document.getElementsByTagName('html')[0].classList.toggle('dark-mode')

      setTimeout(async () => {
        const canvas = await html2canvas(blockToPrint);
        if (isDarkMode) document.getElementsByTagName('html')[0].classList.toggle('dark-mode')
        blockToPrint.style.width = null
        await printJS({
          printable: canvas.toDataURL('image/png'),
          type: 'image',
          documentTitle: 'DynPages - ' + this.title
        })
        loading.dismiss()
      }, 1000)

    } else {
      loading.dismiss()
    }

  }

  dismiss(data?: any, role?: string) {
    this.modalCtrl.dismiss(data, role ? role : (!data ? 'close' : undefined), this.modalId)
  }

}
