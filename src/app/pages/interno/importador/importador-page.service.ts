import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { BackendService } from 'src/app/abstracts/backend-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { environment } from 'src/environments/environment'
import { ImportadorModalPage } from './importador/importador-modal.page'


@Injectable({
  providedIn: 'root'
})
export class ImportadorModalPageService {

  constructor(
    private appUtil: AppUtil,
    private modalCtrl: ModalController,
    private authService: AuthService,
  ) {

  }

  async modal(service: BackendService, title: string, uniqueFields: string[], forceData: object, fields: object, dataExample: (string | number)[][], limiteRegistros = 1000, fieldsTooltip: object = {}): Promise<any> {

    if (!this.authService.hasPermission(environment.roles.contratoUsuarioCargoGrupo.GESTAO)) {
      this.appUtil.alertError('Para importações, solicite a um usuário com cargo de gestão.')
      return
    }

    const modal = await this.modalCtrl.create({
      component: ImportadorModalPage,
      componentProps: { context: 'modal-list', state: { service, title, uniqueFields, forceData, fields, dataExample, limiteRegistros, fieldsTooltip } },
      cssClass: 'modal-draggable modal-big modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

}
