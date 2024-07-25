import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppUtil } from 'src/app/app-util';

import { MediaViewerComponent, MediaViewerType } from './media-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class MediaViewerService {

  constructor(private appUtil: AppUtil, private modalCtrl: ModalController) {


  }

  async present(type: MediaViewerType, src: string, options?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: MediaViewerComponent,
      componentProps: { type, src, options },
      cssClass: 'modal-draggable modal-big modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

}
