import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'

import { AuthPage } from './auth.page'

@Injectable({
  providedIn: 'root'
})
export class AuthPageService extends PageService {

  constructor(private appUtil: AppUtil, private modalCtrl: ModalController) {

    super()

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: AuthPage,
      cssClass: 'modal-draggable modal-adjust modal-small', // light-backdrop
      componentProps: { state: { } },
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    });

    modal.present()

    return modal

  }

  async modalList() {
    throw new Error('Method not implemented.');
  }

  navigate(): Promise<any> {
    throw new Error('Method not implemented.');
  }

}
