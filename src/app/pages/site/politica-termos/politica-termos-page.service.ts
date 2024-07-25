import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'

import { PoliticaTermosPage } from './politica-termos'


@Injectable({
  providedIn: 'root'
})
export class PoliticaTermosPageService extends PageService {

  constructor(private appUtil: AppUtil, private modalCtrl: ModalController) {

    super()

  }

  async modalForm(_: any, tela: 'termos' | 'politica' | 'conta-digital'): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: PoliticaTermosPage,
      componentProps: { state: {}, tela },
      cssClass: 'modal-draggable modal-adjust modal-medium',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalList(filters?: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  navigate(filtersSelectDatas?: FiltersSelectDatas): Promise<any> {
    throw new Error('Method not implemented.');
  }

}
