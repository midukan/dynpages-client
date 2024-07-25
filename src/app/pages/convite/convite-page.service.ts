import { Injectable } from '@angular/core'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'

import { ConvitePage } from './convite.page'

@Injectable({
  providedIn: 'root'
})
export class ConvitePageService extends PageService {

  constructor(
    private appUtil: AppUtil,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) {

    super()

  }

  async modalList(filters?: any): Promise<any> {

    throw new Error('Method not implemented.')

  }

  async modalSelectFull(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ConvitePage,
      componentProps: { context: 'select-full', state: {} },
      cssClass: 'modal-draggable modal-adjust modal-small',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): Promise<any> {

    throw new Error('Method not implemented.')

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas): any {

    const url = '/convite'

    this.navCtrl.navigateForward(url)

  }

}
