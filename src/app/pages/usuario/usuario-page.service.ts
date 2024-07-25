import { Injectable } from '@angular/core'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'

import { UsuarioFormPage } from './usuario-form/usuario-form.page'
import { UsuarioListPage } from './usuario-list/usuario-list.page'

@Injectable({
  providedIn: 'root'
})
export class UsuarioPageService extends PageService {

  constructor(private appUtil: AppUtil, private modalCtrl: ModalController, private navCtrl: NavController) {

    super()

  }

  async modalList(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: UsuarioListPage,
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
      component: UsuarioListPage,
      componentProps: { context: 'select-full', state: { filters } },
      cssClass: 'modal-draggable modal-medium modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, usuario?: any, tela: 'default' | 'senha' | 'config' | 'seguranca' = 'default'): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: UsuarioFormPage,
      componentProps: { state: { filtersSelectDatas, usuario, tela } },
      cssClass: 'modal-draggable modal-adjust ' + (tela === 'default' ? 'modal-medium' : 'modal-small'),
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async navigate(filtersSelectDatas?: FiltersSelectDatas, usuario?: any, tipo: 'painel' | 'criar-conta' = 'criar-conta'): Promise<any> {

    const url = tipo === 'criar-conta' ? '/criar-conta' : '/painel/0/usuario/form'

    this.navCtrl.navigateForward(url, { state: { filtersSelectDatas, usuario } })

  }

}
