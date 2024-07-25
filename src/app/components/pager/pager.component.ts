import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { ActionSheetController, IonContent } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent {

  usuarioLogado: any

  validStart: boolean | null = null

  @Input() itemsCount: number
  @Input() pageOffset = 1
  @Input() pager: any = {}
  @Input() limits: number[] = [10, 20, 50, 100, 200, 500]
  @Input() position: 'default' | 'fixed' | 'right' | 'left' = 'fixed'
  @Input() scrollTo: number
  @Input() scrollToTopIonContent: IonContent

  @Output() appChange: EventEmitter<any> = new EventEmitter

  @ViewChild(IonContent, { static: false }) content: IonContent

  constructor(public authService: AuthService, public appUtil: AppUtil, private actionSheetCtrl: ActionSheetController) {

    this.usuarioLogado = this.authService.getAuth()

  }

  ngOnInit() {

    this.itemsCount = +this.itemsCount
    this.pager.offset = +this.pager.offset || 0
    this.pager.limit = +this.pager.limit

    const page = this.getPageNum()

    this.setOffset(page)

    this.validStart = !!(this.itemsCount !== undefined && this.pager.limit)

  }

  prevPage() {

    if (this.getPageNum() === 1) {
      return
    }

    this.pageClick(this.getPageNum() - 1)

  }

  nextPage() {

    if (this.getPagesCount() === this.getPageNum()) {
      return
    }

    this.pageClick(this.getPageNum() + 1)

  }

  getPagesCount() {

    return Math.ceil(this.itemsCount / this.pager.limit)

  }

  pageClick(page: number, force = false) {

    if (this.getPageNum() === page && !force) {
      return
    }

    this.setOffset(page)

    this.appChange.next({
      pager: this.pager // objeto padrão de filtro de registros (filters.page)
    })

    this.scrollToTopIonContent?.scrollToPoint(0, this.scrollTo, 500)

  }

  getPageNum() {

    return Math.round((this.pager.offset + this.pager.limit) / this.pager.limit)

  }

  setOffset(page: number) {

    this.pager.offset = (page - 1) * this.pager.limit

  }

  setLimit(limit: number) {

    if (this.pager.limit === limit) {
      return
    }

    this.pager.limit = limit

    this.pageClick(1, true)

  }

  async limitActionSheet() {

    const limits = this.limits.map(l => ({ text: '' + l, handler: () => this.setLimit(l) }))

    const as = await this.actionSheetCtrl.create({
      header: 'Registros por página',
      subHeader: 'Altere o limite de exibição.',
      mode: 'ios',
      buttons: [
        ...limits,
        { text: 'Cancelar', role: 'cancel' },
      ]
    })

    as.present()

  }

}
