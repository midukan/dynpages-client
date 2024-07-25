import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'src/app/providers/message.service';

export interface BulkWarningExtraButtom {
  autoClose?: boolean
  ionIcon?: string
  content?: string // =html
  click: (event: any) => void
}

@Component({
  selector: 'app-bulk-warning',
  templateUrl: './bulk-warning.component.html',
  styleUrls: ['./bulk-warning.component.scss'],
})
export class BulkWarningComponent {

  @Input() appExtraButtons: BulkWarningExtraButtom[]
  @Input() forceMobile = false

  @Output() appSelecionaTodos: EventEmitter<any> = new EventEmitter
  @Output() appExcluir: EventEmitter<any> = new EventEmitter

  constructor(private messageService: MessageService) { }

  click(event: any, button: BulkWarningExtraButtom) {

    if (button.autoClose === true || button.autoClose === undefined) {
      setTimeout(() => {
        this.messageService.get('bulk.executed').next(event)
      })
    }

    button.click(event)

  }

  selecionaTodos(event: any) {

    this.appSelecionaTodos.emit(event)

  }

  excluir(event: any) {

    this.messageService.get('bulk.executed').next(event)

    this.appExcluir.emit(event)

  }

}
