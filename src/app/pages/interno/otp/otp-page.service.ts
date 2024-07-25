import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { AppUtil } from 'src/app/app-util'
import { OTPModalPage } from './otp/otp-modal.page'


@Injectable({
  providedIn: 'root'
})
export class OTPModalPageService {

  constructor(
    private appUtil: AppUtil,
    private modalCtrl: ModalController,
  ) {

  }

  async modal(otp: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: OTPModalPage,
      componentProps: { context: 'modal-list', state: { otp } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

}
