import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'
import { AuthService } from 'src/app/providers/auth.service'
import { DataService } from 'src/app/providers/data.service'
import { ContatoPage } from './contato.page'

@Injectable({
  providedIn: 'root'
})
export class ContatoPageService extends PageService {

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



  }

  async modalSelectFull(filters?: any): Promise<any> {



  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ContatoPage,
      componentProps: { state: { filtersSelectDatas, contrato } },
      cssClass: 'modal-draggable modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): any {

    const url = '/contato'

    this.navCtrl.navigateForward(url, { state: { filtersSelectDatas, contrato } })

  }

}
