import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core'
import { Router } from '@angular/router'

import { ListPageContext } from '../abstracts/list-page.abstract'
import { AppUtil } from '../app-util'

@Directive({
  selector: 'tr[appOrder]'
})

export class FiltersOrderDirective implements OnInit {

  filters: any

  @Input() parentContext: ListPageContext = 'page-list'

  @Input() appOrderFilters: any
  @Output() appOrderFiltersChange: EventEmitter<any> = new EventEmitter()

  constructor(public element: ElementRef, public renderer: Renderer2, private router: Router, private appUtil: AppUtil) {


  }

  ngOnInit() {

    setTimeout(() => {

      this.filters = this.appUtil.deepCopy(this.appOrderFilters)

      if (!this.filters.order) {
        this.filters.order = {}
      }

      const ths = this.element.nativeElement.querySelectorAll('th:not(.app-order-disabled)')

      ths.forEach(th => {

        const property = th.attributes.appOrderProperty?.value
        if (!property) return

        th.classList.add('cursor-pointer')
        th.classList.add('list-default-table-header-order')
        th.classList.add('app-icon-sort')

        if (this.filters.order[property]) {
          if (this.filters.order[property] === 'ASC') {
            th.classList.add('app-icon-sort-up')
          } else if (this.filters.order[property] === 'DESC') {
            th.classList.add('app-icon-sort-down')
          }
        }

        th.onclick = () => {

          let ascDesc: 'ASC' | 'DESC' | null = null

          if (!th.classList.contains('app-icon-sort-up') && !th.classList.contains('app-icon-sort-down')) {
            th.classList.add('app-icon-sort-up')
            ascDesc = 'ASC'
          }
          else if (th.classList.contains('app-icon-sort-up')) {
            th.classList.remove('app-icon-sort-up')
            th.classList.add('app-icon-sort-down')
            ascDesc = 'DESC'
          }
          else if (th.classList.contains('app-icon-sort-down')) {
            th.classList.remove('app-icon-sort-down')
            ascDesc = null
          }

          if (ascDesc) {
            this.filters.order = { ...this.filters.order, ...{ [property]: ascDesc } }
          } else {
            delete this.filters.order[property]
          }

          this.setChangeFilters()

        }

      })

    })

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.appOrderFilters?.currentValue) {

      this.filters = this.appUtil.deepCopy(this.appOrderFilters)

    }

  }

  setChangeFilters() {

    const clearedFilters = this.getClearedFilters()

    if (this.parentContext === 'select-lite' || this.parentContext === 'select-full' || this.parentContext === 'modal-list') {
      this.appOrderFiltersChange.next(clearedFilters)
      return
    }

    this.router.navigate([location.pathname], { queryParams: { filters: JSON.stringify(clearedFilters) } })

  }

  getClearedFilters() {

    const clearedFilters = this.appUtil.deepCopy(this.filters)

    Object.entries(clearedFilters).forEach(keyVal => {

      if (keyVal[0].charAt(0) === '_') {
        delete clearedFilters[keyVal[0]]
      }

    })

    return clearedFilters

  }

}
