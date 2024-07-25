import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonContent, LoadingController, ModalController } from '@ionic/angular'
import { Observable, Subscription, finalize, firstValueFrom } from 'rxjs'

import html2canvas from 'html2canvas'
import * as printJS from 'print-js'
import { AppUtil } from '../app-util'
import { FiltersSelectDatas } from '../components/filters/filters.component'
import { PagerComponent } from '../components/pager/pager.component'
import { ISelectData, SelectComponent } from '../components/select/select.component'
import { AuthService } from '../providers/auth.service'
import { MessageService } from '../providers/message.service'
import { SocketService } from '../providers/socket.service'
import { StorageService } from '../providers/storage.service'
import { BackendService, IBasicEntityData } from './backend-service.abstract'
import { BasePage } from './base-page.abstract'
import { PageService } from './page-service.abstract'

export type ListPageContext = 'select-lite' | 'select-full' | 'page-list' | 'modal-list' | 'embed-list'

@Component({
  template: ``
})
export abstract class ListPage extends BasePage {

  @Input('context') context: ListPageContext = 'page-list'

  appSelect: SelectComponent

  opcaoNenhum: boolean
  opcaoCadastrar: boolean

  key: string
  keyEntity: string
  // service?: BackendService
  // pageService: PageService
  loadId = 0

  @Input('filters') filters: any = { pager: { offset: 0, limit: 20 } }
  filtersSelectDatas: FiltersSelectDatas
  filtersMultiple = false

  bulkSelect: boolean = false

  openId: number
  entityChangeAct: 'FIRST' | 'LAST' | null

  @ViewChild(IonContent, { static: false }) content: IonContent
  @ViewChild(PagerComponent, { static: false }) pager: PagerComponent

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected modalCtrl: ModalController,
    protected loadingCtrl: LoadingController,
    protected authService: AuthService,
    protected appUtil: AppUtil,
    protected messageService: MessageService,
    protected storageService: StorageService,
    protected element: ElementRef,
    protected socketService: SocketService,
    protected service?: BackendService,
    protected pageService?: PageService,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

  }

  abstract ngOnInit()

  async ngOnInitDefault(title?: string, key?: string, keyEntity?: string, noInitialLoad = false) {

    if (!title || !key || !keyEntity || !this.pageService) {
      console.error('Falta parâmetros no ngOnInitDefault da ListPage.')
      return
    }

    this.setTitle(title, (this.context === 'select-full') ? 'Selecione um registro...' : 'Consulte e gerencie os registros.')

    this.key = key
    this.keyEntity = keyEntity

    this.isModal = this.getParents().ionModal.nodeName === 'ION-MODAL'

    // todo: da pra usar o de cima?
    this.headerType = (this.context === 'select-full' || this.context === 'select-lite' || this.context === 'modal-list') ? 'modal' : 'page'

    this.subscribers(this.service)

    if (this.context !== 'page-list') {

      if (this.state.filters) {
        // this.filters = { ...this.filters, ...this.appUtil.deepCopy(this.state.filters) }
        this.appUtil.populateObj(this.filters, this.appUtil.deepCopy(this.state.filters))
      }

      if (!noInitialLoad) {
        this.load()
      }

      // reseta para as demais
      // navegação URL / change filters
      noInitialLoad = false

    }

    this.routeData = await new Promise(r => this.routDataSub = this.route.data.subscribe(p => {
      r(p)
    }))

    this.params = await new Promise(r => this.routParamsSub = this.route.params.subscribe(p => {
      r(p)
    }))

    await new Promise(r => this.customSubscriptions.push(this.route.queryParams.subscribe(async p => {

      if (this.context === 'page-list') {

        // const storageLimitName = location.pathname.replace(/\//g, '-')
        // const storageLimitName = this.key
        const storageLimitName = this.element.nativeElement.tagName.toLowerCase()

        let storageLimit = await this.storageService.get('pager.limit.' + storageLimitName)

        if (p.filters) {
          this.filters = JSON.parse(p.filters)
          if (this.filters.pager?.limit) {
            storageLimit = this.filters.pager.limit
            if (!this.filters.pager.noSave) {
              this.storageService.set('pager.limit.' + storageLimitName, this.filters.pager.limit)
            }
          }
        }

        if (!this.filters.pager) {
          this.filters.pager = { offset: 0, limit: storageLimit || 20 }
        } else {
          this.filters.pager.limit = storageLimit || 20
        }

        // responsável por chamar o ngChanges e dar reload no this.filters dentro do filters cmp
        this.filters = this.appUtil.deepCopy(this.filters)

        // console.log('bbb', this.filters)

        if (p.openId) {
          this.openId = +p.openId
          const queryParams = this.appUtil.deepCopy(p)
          delete queryParams.openId
          // const filters = JSON.parse(queryParams.filters || '{}')
          // delete filters.id
          // queryParams.filters = JSON.stringify(filters)
          this.router.navigate([location.pathname], { queryParams })
          return // não deixa fazer um duplo load
        }

        // if (this.state.filters) {
        //   this.filters = { ...this.filters, ...this.appUtil.deepCopy(this.state.filters) }
        // }

        if (!noInitialLoad) {
          this.load()
        }

        // reseta para as demais
        // navegação URL / change filters
        noInitialLoad = false

      } else {

        // this.filters = { pager: { offset: 0, limit: 2 } }

      }

      r(p)

    })))

    if (this.service) {

      this.customSubscriptions.push(this.service.setState.subscribe(state => {
        this.setState(state)
      }))

      this.customSubscriptions.push(this.service.entityChanger.subscribe(async data => {

        let entityToChange: any = null

        if (data.direction === 'PREV') {

          let prev: any = null
          this[this.key].forEach(dig => {
            if (data.id === dig.id) {
              entityToChange = prev
            }
            prev = dig
          })

        } else if (data.direction === 'NEXT') {

          let foundId = false
          this[this.key].forEach(dig => {
            if (foundId) {
              entityToChange = dig
              foundId = false
            }
            if (data.id === dig.id) {
              foundId = true
            }
          })

        }

        if (entityToChange) {

          this.service?.entityFormUpdate.next(entityToChange)

        } else { // via event, paginar e solicitar abertura do primeiro ou último registro

          this.entityChangeAct = null

          if (data.direction === 'PREV') {

            if (!this.filters.pager.offset) {
              this.appUtil.toast('Sem registros para trás.', 1000, 'warning', { position: 'top' })
              return
            }

            this.entityChangeAct = 'LAST'

            const loading = await this.loadingCtrl.create({ message: 'Carregando...' })
            loading.present()

            this.pager.prevPage()

          } else if (data.direction === 'NEXT') {

            if (this[this.key + 'Total'].total <= this.filters.pager.offset + this.filters.pager.limit) {
              this.appUtil.toast('Sem registros para frente.', 1000, 'warning', { position: 'top' })
              return
            }

            this.entityChangeAct = 'FIRST'

            const loading = await this.loadingCtrl.create({ message: 'Carregando...' })
            loading.present()

            this.pager.nextPage()

          }

        }

      }))

    }

    // this.title = title
    // this.subtitle = (this.context === 'select-full') ? 'Selecione um registro...' : 'Consulte e gerencie os registros.'

  }

  ionViewDidEnter() {
    this.ionViewDidEnterDefault()
  }

  async ionViewDidEnterDefault() {
    await super.ionViewDidEnterDefault()
  }

  ngOnDestroy() {
    this.ngOnDestroyDefault()
  }

  ngOnDestroyDefault() {

    super.ngOnDestroyDefault()

  }

  subscribers(service: BackendService | undefined, key?: string) {

    key = key || this.key

    this.customSubscriptions.push(service?.entityUpdated.subscribe(data => {
      this.load()
    }) as Subscription)

    this.customSubscriptions.push(this.socketService.getMsg(this.env.enums.IdDataSocket.LIST_REFRESH).subscribe(data => {
      if (data.list === this.keyEntity) this.load()
    }) as Subscription)

  }

  async load(hiddenLoad = false) {

    if (!this.service) {
      console.error('Nenhum serviço setado para usar no load().')
      return
    }

    await this.beforeLoad()

    this.loadDefault([
      this.service.getMany(this.filters)
    ], hiddenLoad)

  }

  async loadDefault(requestObservables: Observable<any>[], hiddenLoad = false) {

    // setar para ativar o loading dots
    if (!hiddenLoad) {
      this[this.key] = undefined;
    }

    if (this.state.registros) {
      this[this.key] = this.appUtil.deepCopy(this.state.registros);
      this.afterLoad()
      return
    }

    const loadId = ++this.loadId

    const dataGroup = await Promise.all(requestObservables.map(obs => firstValueFrom(obs)))
      .catch((err) =>
        this.appUtil.pageRequestError(err)
      );

    if (loadId === this.loadId) {
      this.appUtil.setDataGroup(dataGroup, this)
      this.afterLoad()
    }

  }

  async beforeLoad() {

  }

  async afterLoad() {

    await this.afterLoadDefault()

  }

  async afterLoadDefault() {

    if (this.openId) {
      const entityOpen = this[this.key].find((p) => p.id === this.openId);
      if (entityOpen) {
        await this.seleciona(entityOpen)
      }
    }

    if (this.entityChangeAct) {

      let entityToChange: any

      if (this.entityChangeAct === 'FIRST') {
        entityToChange = this[this.key][0]
      } else if (this.entityChangeAct === 'LAST') {
        entityToChange = this[this.key][this[this.key].length - 1]
      }

      if (entityToChange) {
        this.service?.entityFormUpdate.next(entityToChange)
      }

      this.loadingCtrl.dismiss()
      this.entityChangeAct = null

    }

  }

  async seleciona(registro?: any) {

    await this.selecionaDefault(registro, entity => {
      return entity.nomeCompleto || entity.nome || entity.descricao || entity.codigo || entity.id
    })

  }

  async selecionaDefault(entity?: any, textParse?: (entity: IBasicEntityData) => string) {

    if (this.bulkSelect) {
      entity.selected = !entity.selected;
      return;
    }

    if (this.context === 'select-lite' || this.context === 'select-full') {

      const entityCopy = this.appUtil.deepCopy(entity)

      const selectData = entityCopy ? { id: entityCopy.id, text: textParse ? textParse(entityCopy) : 'Falha!', original: entityCopy } : null;

      if (this.filtersMultiple) {
        this.addToFiltersItem(selectData)
      } else {
        this.modalCtrl.dismiss({ that: this, selectData })
      }

    } else {

      return await this.form(entity)

    }

  }

  async form(registro?: any) {

    return await this.formDefault(registro)

  }

  async formDefault(registro?: any) {

    // console.log(this.filtersSelectDatas)

    const modal = await this.pageService?.modalForm(this.filtersSelectDatas, registro);

    // modal pode não existir se o seleciona usa somente para selecionar nos selects
    modal?.onDidDismiss().then((data) => {
      this.autoSelecionaData(data, this.keyEntity);
    })

    return modal

  }

  async print(event: any) {

    if (!event) return

    const loading = await this.loadingCtrl.create({ message: 'Gerando...' })
    await loading.present()

    let element = event.srcElement

    let limit = 15

    while (1) {

      if (!element?.parentElement) {
        loading.dismiss()
        break
      }

      element = element.parentElement

      if (element.classList.contains('list-default') || element.classList.contains('printable-content')) {
        break
      }

      if (!--limit) {
        console.error('Falha ao localizar .list-default.')
        element = null
        loading.dismiss()
        break
      }

    }

    if (element) {

      let blockToPrint = element.querySelectorAll('.list-default-body, .printable-content-body')
      blockToPrint = blockToPrint[blockToPrint.length - 1]

      blockToPrint.style.width = 'max-content'

      const isDarkMode = document.getElementsByTagName('html')[0].classList.contains('dark-mode')
      if (isDarkMode) document.getElementsByTagName('html')[0].classList.toggle('dark-mode')

      setTimeout(async () => {
        // blockToPrint.style.width = '1600px'
        const canvas = await html2canvas(blockToPrint);
        await printJS({
          printable: canvas.toDataURL('image/png'),
          type: 'image',
          documentTitle: 'DynPages - ' + this.title
        })
        if (isDarkMode) document.getElementsByTagName('html')[0].classList.toggle('dark-mode')
        blockToPrint.style.width = null
        loading.dismiss()
      }, 1000)

    } else {
      loading.dismiss()
    }

  }

  async exportacao(event: Event) {

    if (!this.service?.downloadExportacao) return

    const loading = await this.loadingCtrl.create({ message: 'Gerando...' });
    loading.present();

    this.service
      .downloadExportacao(this.filters)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: (data) => {

          this.appUtil.openFileWindow(data.file!, true)
          this.appUtil.toast('Exportação concluída com sucesso.', 3000, 'success');

        },
        error: (err) => this.appUtil.pageRequestError(err, 'alert'),
      })

  }

  report() { }

  getFormSelecionaData(data: any, key: string) {

    const that = data.data?.that || this

    if (data.data
      && (that.context === 'select-lite' || that.context === 'select-full')
      && (data.data[key] || data.data.selectData?.original)
      && !data.role) {

      return data.data[key] || data.data.selectData.original

    }

    return null

  }

  autoSelecionaData(data: any, key: string) {

    const entity = this.getFormSelecionaData(data, key)

    if (entity) {
      this.seleciona(entity)
    }

  }

  pagerChange() {
    if (this.context === 'select-lite' || this.context === 'select-full' || this.context === 'modal-list') {
      this.load()
      return
    }
    this.router.navigate([location.pathname], { queryParams: { filters: JSON.stringify(this.filters) } })
  }

  async showBulkSelect() {

    this.bulkSelect = !this.bulkSelect

    if (this.bulkSelect) {
      this[this.key].forEach(ent => {
        ent.selected = false
      })
    }

  }

  async excluirSelecionados() {

    await this.excluirSelecionadosDefault()

  }

  async excluirSelecionadosDefault(registros?: any[]) {

    if (!this.service) {
      console.error('Nenhum serviço setado para usar no excluirSelecionadosDefault().')
      return
    }

    const entities = (registros || this[this.key]).filter((p) => p.selected)
    if (!entities || entities.length === 0) return

    const loading = await this.loadingCtrl.create({ message: 'Excluindo...' })
    loading.present()

    this.service
      .delete(entities)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: (data) => {
          this.service?.entityUpdated.next(null)
        },
        error: (err) => this.appUtil.pageRequestError(err, 'alert'),
      })

  }

  selecionaTodos() {
    this.selecionaTodosDefault()
  }

  selecionaTodosDefault(registros?: any[]) {
    const entities = registros || this[this.key]
    const acaoBool = entities[0] ? !entities[0].selected : true
    entities.forEach((servico) => (servico.selected = acaoBool))
  }

  addToFiltersItem(selectData: ISelectData | null) {

    this.state.selectData = this.state.selectData || []

    if (this.state.selectData.length >= this.filtersMultiple) {
      this.appUtil.alertError('Você pode selecionar até ' + this.filtersMultiple + ' itens.')
      return
    }

    if (this.state.selectData.some(sd => sd.id === selectData?.id)) {
      return
    }

    if (selectData) {
      this.state.selectData.push(selectData)
    } else {
      this.state.selectData = null
    }

    setTimeout(() => {
      this.appSelect?.addFilterItem(selectData)
      this.messageService.get('modal.resize').next(null)
    })

  }

  some(array: ISelectData | ISelectData[], key: string, value: any) {

    if (!array) {
      return false
    }

    if (array instanceof Array) {
      return array.some(a => a[key] === value)
    } else {
      return array.id === value
    }

  }

  dismissSelectDataMultiple() {

    this.dismiss({ selectData: this.state.selectData })

  }

  dismiss(data?: any, role?: string) {
    this.modalCtrl.dismiss(data, role ? role : (!data ? 'close' : undefined), this.modalId)
  }

}
