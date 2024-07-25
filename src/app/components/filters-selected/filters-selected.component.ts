import { Component, Input, SimpleChanges } from '@angular/core'
import { AppUtil } from 'src/app/app-util'
import { MessageService } from 'src/app/providers/message.service'

import { ISelectData, SelectComponent } from '../select/select.component'

@Component({
  selector: 'app-filters-selected',
  templateUrl: './filters-selected.component.html',
  styleUrls: ['./filters-selected.component.scss'],
})
export class FiltersSelectedComponent {

  selectDataInternal: ISelectData[]

  @Input() selectData: ISelectData[]
  @Input() appSelect: SelectComponent

  // @Output() appClickRem: EventEmitter<number> = new EventEmitter<number>()

  constructor(private messageService: MessageService, private appUtil: AppUtil) { }

  // ngOnInit() {

  //   // this.selectDataInternal = this.selectData

  // }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.selectData) {

      this.selectDataInternal = changes.selectData?.currentValue // usa via end. memo.

    }

  }

  remFromFiltersItem(id: number) {

    this.selectDataInternal.splice(this.selectDataInternal.findIndex(sd => sd.id === id), 1)
    this.appSelect?.removeFilterItem(id)

    // this.appClickRem.emit(id)

    setTimeout(() => {
      this.messageService.get('modal.resize').next(null)
    })

  }

}
