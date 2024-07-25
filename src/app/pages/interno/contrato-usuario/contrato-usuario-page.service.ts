import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'
import { AuthService } from 'src/app/providers/auth.service'
import { DataService } from 'src/app/providers/data.service'

import { ContratoUsuarioFormPage } from './contrato-usuario-form/contrato-usuario-form.page'
import { ContratoUsuarioListPage } from './contrato-usuario-list/contrato-usuario-list.page'

@Injectable({
  providedIn: 'root'
})
export class ContratoUsuarioPageService extends PageService {

  constructor(
    private appUtil: AppUtil,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
  ) {

    super()

  }

  async modalList(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ContratoUsuarioListPage,
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
      component: ContratoUsuarioListPage,
      componentProps: { context: 'select-full', state: { filters } },
      cssClass: 'modal-draggable modal-medium modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, contratoUsuario?: any, contratoId?: number, isViaUsuarioList = false): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ContratoUsuarioFormPage,
      componentProps: { state: { filtersSelectDatas, contratoUsuario, contratoId, isViaUsuarioList, hideUsuario: false } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalFormVinculo(perfil: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ContratoUsuarioFormPage,
      componentProps: { state: { perfil, hideUsuario: true } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): any {

    const url = '/painel/' + this.authService.getContrato().id + '/contrato-usuario/form'

    this.navCtrl.navigateForward(url, { state: { filtersSelectDatas, contrato } })

  }

}
