import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular'
import { finalize, tap } from 'rxjs'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ConfigService } from 'src/app/providers/config.service'
import { MessageService } from 'src/app/providers/message.service'
import { MiscService } from 'src/app/providers/misc.service'
import { StorageService } from 'src/app/providers/storage.service'
import { environment } from 'src/environments/environment'

import { SocketService } from 'src/app/providers/socket.service'
import { ConfigPageService } from '../config-page.service'

@Component({
  selector: 'app-config-list-page',
  templateUrl: './config-list.page.html',
  styleUrls: ['./config-list.page.scss'],
})
export class ConfigListPage extends ListPage {

  configs: any;
  configsTotal: any;

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    public storageService: StorageService,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    protected messageService: MessageService,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    private configService: ConfigService,
    private alertCtrl: AlertController,
    protected element: ElementRef,
    private miscService: MiscService,
    protected configPageService: ConfigPageService,
    protected socketService: SocketService,
  ) {
    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, configService, configPageService);
  }

  async ngOnInit() {

    await this.ngOnInitDefault('Configurações', 'configs', 'config', true)

    this.subtitle = 'Configurações deste ambiente.'

    this.filters.pager.limit = 0

    this.load()

  }

  async afterLoad() {

    this.configs.forEach(config => {
      if (config.tipo === this.env.enums.ConfigTipo.FLOAT) {
        config.value = this.appUtil.dinheiro(config.value, false, 2)
      } else if (config.tipo === this.env.enums.ConfigTipo.OBJECT) {
        config.value = JSON.stringify(config.value)
      }
    })

  }

  async salvar() {

    const loading = await this.loadingCtrl.create({ message: 'Salvando...' })
    loading.present()

    const configs = this.appUtil.deepCopy(this.configs)

    configs.forEach(config => {
      if (config.tipo === this.env.enums.ConfigTipo.FLOAT) {
        let ajusteFloat = config.value.replace(',', '')
        ajusteFloat = ajusteFloat.slice(0, -2) + ',' + ajusteFloat.slice(-2);
        config.value = this.appUtil.dinheiro(ajusteFloat, false, 2)
      } else if (config.tipo === this.env.enums.ConfigTipo.OBJECT) {
        config.value = config.value
      }
    })

    this.configService.save({ configs })
      .pipe(finalize(() => {
        loading.dismiss()
      }))
      .subscribe({
        next: async data => {

          this.appUtil.toast('Alterado com sucesso.', 2000, 'success')

          this.miscService.start()
            .pipe(tap(data => {
              this.appUtil.populateObj(environment, data.environment)
            }))
            .subscribe()

        }, error: err => {

          this.appUtil.alertError(err)

        }
      })

  }

  async seleciona(config?: any) {
    throw new Error('Methos not implemented.')
  }

  async form(config?: any) {
    throw new Error('Methos not implemented.')
  }

}
