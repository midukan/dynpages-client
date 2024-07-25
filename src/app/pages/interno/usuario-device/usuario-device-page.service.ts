import { Injectable } from '@angular/core'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'

import { UsuarioDevicePage } from './usuario-device.page'

@Injectable({
  providedIn: 'root'
})
export class UsuarioDevicePageService extends PageService {

  constructor(
    private appUtil: AppUtil,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) {

    super()

  }

  async modalList(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: UsuarioDevicePage,
      componentProps: { context: 'modal-list', state: { filters } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalSelectFull(filters?: any): Promise<any> {

    throw new Error('Method not implemented.')

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): Promise<any> {

    throw new Error('Method not implemented.')

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas): any {

    const url = '/usuario'

    this.navCtrl.navigateForward(url)

  }

}
