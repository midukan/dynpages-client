import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'

import { PerfilCartaoFormPage } from './perfil-cartao-form/perfil-cartao-form.page'
import { PerfilCartaoListPage } from './perfil-cartao-list/perfil-cartao-list.page'


@Injectable({
  providedIn: 'root'
})
export class PerfilCartaoPageService extends PageService {

  constructor(private appUtil: AppUtil, private modalCtrl: ModalController) {

    super()

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, perfilCartao?: any, perfilId?: number): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: PerfilCartaoFormPage,
      componentProps: { state: { filtersSelectDatas, perfilCartao, perfilId } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async modalList(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: PerfilCartaoListPage,
      componentProps: { context: 'modal-list', state: { filters } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

}
