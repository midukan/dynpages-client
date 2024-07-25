import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { ModalController, NavController } from '@ionic/angular'
import { PageService } from 'src/app/abstracts/page-service.abstract'
import { AppUtil } from 'src/app/app-util'
import { FiltersSelectDatas } from 'src/app/components/filters/filters.component'
import { AuthService } from 'src/app/providers/auth.service'
import { DataService } from 'src/app/providers/data.service'
import { environment } from 'src/environments/environment'

import { ContratoFormPage } from './contrato-form/contrato-form.page'
import { ContratoListPage } from './contrato-list/contrato-list.page'

@Injectable({
  providedIn: 'root'
})
export class ContratoPageService extends PageService {

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

  async posAuthAction(usuario: any, forceCreateContrato = false) {

    const url = this.dataService.get('pathnameRedir') || environment.paths.isAuthUrl

    const splitUrl = url.split('.com.br').pop().split(':4200').pop().split('/')
    const urlContratoId = (!environment.configs.APP_MULT_AMB ? environment.configs.CONTRATO_ID_DEFAULT : +splitUrl[2]) || this.authService.getContrato().id

    // const splitUrlDefault = (!location.pathname.includes('auth') ? environment.paths.isAuthUrl : environment.paths.isAuthUrlAdmin).split('/')

    if (!urlContratoId && environment.configs.APP_MULT_AMB) {

      if (forceCreateContrato) { // Utilizado na criação de nova conta com plano selecionado
        this.navCtrl.navigateForward('/painel/criar-contrato/form')
        return
      }

      if (usuario.contratoUsuarios.length === 1) {

        const modalTop = await this.modalCtrl.getTop()
        modalTop?.dismiss()

        splitUrl[2] = usuario.contratoUsuarios[0].contratoId
        this.router.navigateByUrl(splitUrl.join('/'), { replaceUrl: true })

        return

      }

      const modal = await this.modalCtrl.create({
        component: ContratoListPage,
        componentProps: { context: 'select-full', forceSelect: true, opcaoNenhum: false, state: { registros: !usuario.isMasterAdmin ? usuario.contratoUsuarios.map(ep => ep.contrato) : null } },
        cssClass: 'modal-draggable modal-big modal-adjust',
        backdropDismiss: false,
        enterAnimation: this.appUtil.enterAnimation('grow'),
        leaveAnimation: this.appUtil.leaveAnimation('grow'),
      })

      modal.onDidDismiss().then(data => {

        const id = data.data?.selectData?.id

        if (id) {
          splitUrl[2] = data.data.selectData.id
          if (this.dataService.get('pathnameRedir')) location.href = splitUrl.join('/') // Quando altera contrato 0 na URL, não navegava de forma convencional
          else this.router.navigateByUrl(splitUrl.join('/'), { replaceUrl: true })
        }

      })

      modal.present()

      return

    }

    this.navCtrl.navigateRoot(url)

  }

  async modalList(filters?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ContratoListPage,
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
      component: ContratoListPage,
      componentProps: { context: 'select-full', state: { filters } },
      cssClass: 'modal-draggable modal-medium modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  async modalForm(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): Promise<any> {

    const modal = await this.modalCtrl.create({
      component: ContratoFormPage,
      componentProps: { state: { filtersSelectDatas, contrato } },
      cssClass: 'modal-draggable modal-big modal-adjust',
      enterAnimation: this.appUtil.enterAnimation('grow'),
      leaveAnimation: this.appUtil.leaveAnimation('grow'),
    })

    modal.present()

    return modal

  }

  navigate(filtersSelectDatas?: FiltersSelectDatas, contrato?: any): any {

    const url = '/painel/0/contrato/form'

    this.navCtrl.navigateForward(url, { state: { filtersSelectDatas, contrato } })

  }

}
