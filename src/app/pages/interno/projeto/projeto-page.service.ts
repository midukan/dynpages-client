import { Injectable } from '@angular/core'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'
import { AuthService } from 'src/app/providers/auth.service'

import { ProjetoFormPage } from './projeto-form/projeto-form.page'
import { ProjetoListPage } from './projeto-list/projeto-list.page'

@Injectable({
  providedIn: 'root'
})
export class ProjetoPageService extends PageService {

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
      component: ProjetoListPage,
      componentProps: { context: 'modal-list', state: { filters } },
      cssClass: 'modal-draggable modal-adjust modal-medium',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalSelectFull(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ProjetoListPage,
      componentProps: { context: 'select-full', state: { filters } },
      cssClass: 'modal-draggable modal-adjust modal-medium',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, projeto?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ProjetoFormPage,
      componentProps: { state: { filtersSelectDatas, projeto } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas, projeto?: any): Promise<boolean> {

    const url = '/painel/' + this.authService.getContrato().id + '/' + projeto.tipo.toLowerCase() + '/form'

    return this.navCtrl.navigateForward(url, { state: { filtersSelectDatas, projeto } })

  }

}
