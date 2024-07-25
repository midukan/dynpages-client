import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonPopover, LoadingController, ModalController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs'
import { ListPage } from 'src/app/abstracts/list-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { StorageService } from 'src/app/providers/storage.service'
import { UsuarioDeviceService } from 'src/app/providers/usuario-device.service'

import { SocketService } from 'src/app/providers/socket.service'
import { UsuarioDevicePageService } from './usuario-device-page.service'

@Component({
  selector: 'app-usuario-device-page',
  templateUrl: './usuario-device.page.html',
  styleUrls: ['./usuario-device.page.scss']
})
export class UsuarioDevicePage extends ListPage {

  usuarioDevices: any[] | undefined

  currentUsuarioDeviceId: number | null

  realIP: string

  @ViewChild('infoISPPop') infoISPPopRef: IonPopover

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    protected authService: AuthService,
    public appUtil: AppUtil,
    protected platform: Platform,
    protected route: ActivatedRoute,
    protected element: ElementRef,
    protected messageService: MessageService,
    protected storageService: StorageService,
    private usuarioDeviceService: UsuarioDeviceService,
    protected socketService: SocketService,
    private usuarioDevicePageService: UsuarioDevicePageService,
    protected loadingCtrl: LoadingController,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, messageService, storageService, element, socketService, usuarioDeviceService, usuarioDevicePageService)

  }

  async ngOnInit() {

    this.currentUsuarioDeviceId = await this.usuarioDeviceService.getUsuarioDeviceId(this.usuarioLogado.id)

    await this.ngOnInitDefault('Usuario Device', 'usuarioDevices', 'usuarioDevice')

    this.realIP = await this.appUtil.getRealIP()

  }

  async beforeLoad() {

    this.filters.pager = { limit: 0 }

  }

  async save(usuarioDevice: any) {

    // const loading = await this.loadingCtrl.create({message: 'Salvando...'})
    // loading.present()

    this.usuarioDeviceService.save({ usuarioDevice })
      // .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: data => this.appUtil.toast('Dispositivo atualizado com sucesso.', 2000, 'success'),
        error: err => this.appUtil.alertError(err),
      })

  }

  async testarNotificacao(usuarioDevice: any) {

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' })
    loading.present()

    this.usuarioDeviceService.testarNotificacao(usuarioDevice.id)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: data => this.appUtil.toast('Mensagem de notificação enviada.', 2000, 'success'),
        error: err => this.appUtil.alertError(err),
      })

  }

  async desconectar(usuarioDevice: any) {

    const alert = await this.appUtil.alertMessage('Será necessário entrar com seu login e senha novamente neste dispositivo.', {}, async () => {

      const loading = await this.loadingCtrl.create({ message: 'Desconectando...' })
      loading.present()

      this.usuarioDeviceService.delete(usuarioDevice)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe({
          next: data => {
            this.appUtil.toast('Dispositivo desconectado. Para acessar novamente, entre novamente com seu login.', 2000, 'success')
            this.load(true)
          },
          error: err => this.appUtil.alertError(err),
        })

    }, () => { })

  }

  async seleciona(registro?: any) {
    throw new Error('Method not implemented.')
  }

  async form(registro?: any) {
    throw new Error('Method not implemented.')
  }

}
