import { Component, Input } from '@angular/core'
import { Router, UrlTree } from '@angular/router'

export interface ListSummaryItem {
  id: string
  appIcon?: string
  color?: string
  label: string
  text: string
  note?: string
  noteTitle?: string
  active?: boolean
  routerLink?: UrlTree | string
  click?: (summary: ListSummaryItem, index: number) => void
}

@Component({
  selector: 'app-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss'],
})
export class ListSummaryComponent {

  @Input() summaries: ListSummaryItem[]

  constructor(private router: Router) { }

  summaryClick(summary: ListSummaryItem, index: number) {

    if (summary.click) {
      summary.click(summary, index)
    }

    if (summary.routerLink) {
      this.router.navigateByUrl(summary.routerLink)
    }

  }

}
