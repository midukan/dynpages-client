import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { IonContent } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-anexo',
  templateUrl: './anexo.component.html',
  styleUrls: ['./anexo.component.scss'],
})
export class AnexoComponent {

  env = environment

  usuarioLogado: any

  validStart: boolean | null = null

  anexoBaseTipos = Object.entries(this.env.enums.AnexoBaseTipoStr).map(pt => ({ label: this.env.enums.AnexoBaseTipoStr[pt[0]], value: pt[0] }))

  @Input() entity: any
  @Input() keyArr: string
  @Input() maxSize: number
  @Input() errorPrevKey: string

  @Input() errors: any
  @Output() errorsChange: EventEmitter<any[]> = new EventEmitter()

  @ViewChild(IonContent, { static: false }) content: IonContent

  constructor(public authService: AuthService, public appUtil: AppUtil) {

    this.usuarioLogado = this.authService.getAuth()

  }

  ngOnInit() {

    this.validStart = !!(this.entity !== undefined && this.keyArr)



  }

  novoAnexo() {

    const anexoAdd: any = {
      id_INSERT: Math.random(),
      tipo: this.env.enums.AnexoBaseTipo.ARQUIVO,
    }

    this.entity[this.keyArr].push(anexoAdd)

  }

  arquivoOpenDialog(anexo: any, files?: FileList) {

    this.appUtil.uploadSelect(anexo, 'arquivo', '.jpg,.png,.pdf,.txt,.csv,.json,.xml,.xml,.doc,.xls,.xlsx,.docx,.ppt,.pptx',
      undefined, this.env.configs.FOTO_MAX_WIDTH, this.env.configs.FOTO_MAX_HEIGHT, this.env.configs.FOTO_QUALITY, undefined, files)
      .then(files => {

        files.forEach((file, idx) => {

          if (file.size > this.maxSize * 1024 * 1024) {

            this.appUtil.alertError('Tamanho máximo do anexo é de: ' + this.maxSize + 'mb')
            file.entity.arquivoUpload = undefined

          }

        })

      })
      .catch(err => this.appUtil.alertError(err))

  }

  arquivoDrop(anexo: any, event) {

    event.preventDefault()
    this.arquivoOpenDialog(anexo, event.dataTransfer.files)

  }

  downloadAnexo(anexo: any) {

    this.appUtil.openUrl(anexo.arquivoUrl, '_blank')

  }

  removeAnexo(anexo?: any) {

    this.entity[this.keyArr].forEach((ca, idx) => {

      if (ca !== anexo) {
        return
      }

      if (!ca.id) {
        this.entity[this.keyArr].splice(idx, 1)
      } else {
        ca.delete = !ca.delete
      }

    })

  }

}
