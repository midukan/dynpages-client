import { Injectable } from '@angular/core'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'
import { AuthService } from 'src/app/providers/auth.service'

import { PerfilFormPage } from './perfil-form/perfil-form.page'
import { PerfilListPage } from './perfil-list/perfil-list.page'

@Injectable({
  providedIn: 'root'
})
export class PerfilPageService extends PageService {

  constructor(
    private appUtil: AppUtil,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private authService: AuthService,
    ) {

    super()

  }

  async modalList(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: PerfilListPage,
      componentProps: { context: 'modal-list', state: { filters } },
      cssClass: 'modal-draggable modal-medium modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalSelectFull(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: PerfilListPage,
      componentProps: { context: 'select-full', state: { filters } },
      cssClass: 'modal-draggable modal-medium modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, perfil?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: PerfilFormPage,
      componentProps: { state: { filtersSelectDatas, perfil } },
      cssClass: 'modal-draggable modal-big modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas, perfil?: any): Promise<boolean> {

    const url = '/painel/' + this.authService.getContrato().id + '/' + perfil.tipo.toLowerCase() + '/form'

    return this.navCtrl.navigateForward(url, { state: { filtersSelectDatas,  perfil } })

  }

}
