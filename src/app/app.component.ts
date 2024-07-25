import { Component, HostListener } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { AlertController, ModalController, Platform } from '@ionic/angular'
import { environment } from 'src/environments/environment'

import { AppUtil } from './app-util'
import { PoliticaTermosPageService } from './pages/site/politica-termos/politica-termos-page.service'
import { AuthService } from './providers/auth.service'
import { MessageService } from './providers/message.service'
import { SocketService } from './providers/socket.service'
import { StorageService } from './providers/storage.service'
import { UsuarioDeviceService } from './providers/usuario-device.service'

// import { SplashScreen } from '@capacitor/splash-screen';
// import { StatusBar } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  env = environment;

  usuarioLogado: any;

  showAceiteCookies = false

  blinkLGPD = false

  tutorialPWAShowed = true

  @HostListener('window:popstate', ['$event'])
  async onPopState(event: any) {
    const modalTop = await this.modalCtrl.getTop()
    if (modalTop) {
      modalTop.dismiss()
    }
  }

  constructor(
    public platform: Platform,
    public appUtil: AppUtil,
    public router: Router,
    public route: ActivatedRoute,
    private alertCtrl: AlertController,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    public authService: AuthService,
    private socketService: SocketService,
    private usuarioDeviceService: UsuarioDeviceService,
    private messageService: MessageService,
    private politicaTermosPageService: PoliticaTermosPageService,
  ) {

    (window as any).GLOBAL_MOBILE_WIDTH = 1100

    this.appUtil.midukan()

    // let blinkTO
    // this.messageService.get('lgpd.blink').subscribe(() => {
    //   this.blinkLGPD = true
    //   if (blinkTO) {
    //     clearTimeout(blinkTO)
    //   }
    //   blinkTO = setTimeout(() => {
    //     this.blinkLGPD = false
    //   }, 1000)
    // })

    this.usuarioLogado = this.authService.getAuth()

    this.initializeApp()

    this.messageService.get<boolean>('aceitaCookie.show').subscribe(b => {
      this.showAceiteCookies = b
    })

    this.messageService.get('modal.create').subscribe(() => {
      history.pushState(null, '')
    })

  }

  initializeApp() {

    if (this.platform.is('capacitor')) {

      this.platform.ready().then(() => {

        // StatusBar.setOverlaysWebView({ overlay: true })
        // SplashScreen.hide()

        this.subscribeUpdater()

        this.startApp(true)

      })

    } else {

      this.startApp(false)

    }

  }

  async subscribeUpdater() {

    // "@capgo/capacitor-updater": "^4.13.6",

    // await CapacitorUpdater.notifyAppReady()

    // let version: any

    // const current = (await CapacitorUpdater.current()).bundle

    // const bundles = (await CapacitorUpdater.list()).bundles

    // await this.appUtil.parallelForEach(bundles, async bundle => {
    //   if (bundle.status !== 'success') {
    //     CapacitorUpdater.delete({ id: bundle.id })
    //   }
    // })

    // await CapacitorUpdater.addListener('download', (info: any) => {
    //   this.ngZone.run(() => {
    //     // this.updateProgress = info.percent / 100
    //   })
    // })

    // await CapacitorUpdater.addListener('downloadComplete', async (info: any) => {

    //   this.updateProgress = 0

    //   setTimeout(async () => {

    //     if (version.checksum !== current.checksum) {

    //       const alert = await this.alertCtrl.create({
    //         backdropDismiss: false,
    //         header: 'Atualização',
    //         message: 'Para continuar, você deve atualizar seu app.',
    //         buttons: [{
    //           text: 'Atualizar',
    //           handler: async () => {

    //             await CapacitorUpdater.set(version)

    //           }
    //         }]
    //       })

    //       alert.present()

    //     }

    //   }, 2000)

    // })

    // version = await CapacitorUpdater.download({
    //   url: 'https://sigma-yacht-client.caprover.midukan.com.br/assets/releases/latest.zip',
    //   version: 'latest'
    // })

  }

  aceitarCookies() {

    this.storageService.set('cookiesAceitos', true)

    this.showAceiteCookies = false

  }

  closePWATutorial(naoMostrarMais = false) {

    if (naoMostrarMais) {
      this.storageService.set('tutorialPWAShowed', true)
    }

    this.tutorialPWAShowed = true

  }

  politicaTermosFaqModal(tela: 'termos' | 'politica') {

    this.politicaTermosPageService.modalForm([], tela)

  }

  private async startApp(isNative: boolean) {

    if (!isNative) {

      if (location.host.includes('www.')) {
        location.host = location.host.replace('www.', '')
        return
      }

      this.route.queryParams.subscribe(p => {
        if (p.utm_source || p.utm_medium || p.utm_campaign) {
          this.storageService.set('utm', {
            utmSource: p.utm_source,
            utmMedium: p.utm_medium,
            utmCampaign: p.utm_campaign,
          })
          location.search = ''
        }
      })

    }

    this.socketService.getMsg(this.env.enums.IdDataSocket.AUTH_UPD).subscribe(data => {
      this.authService.auth().subscribe()
    })

    this.router.events.subscribe(async event => {

      if (!this.env.configs) return // Esse evento ocorre também antes de carregar o misc/start

      if (event instanceof NavigationEnd) {

        await this.authService.loadAuthContrato()
          .catch(err => {
            this.authService.logout(true)
            this.appUtil.alertError(err)
            this.router.navigateByUrl(this.env.paths.noAuthUrl)
          })

        const body = document.getElementsByTagName('body')[0]

        if (document.title.includes('Ops!')) {
          return
        }

        const currentUrl = this.router.routerState.snapshot.url; // event.url
        setTimeout(() => {
          this.socketService.sendMsg(this.env.enums.IdDataSocket.PAGE, { currentTitle: document.title.replace(' - ' + this.env.infos?.appName, ''), currentUrl })
        }, 1000)

        if (currentUrl.includes('/painel/')) {
          body.classList.add('painel')
        }
        else {
          body.classList.remove('painel')
        }

      }
    })

    // Caso o server reinicie
    this.socketService.onConnect(async () => {

      const access_token = this.authService.isAuth() ? await this.storageService.get('access_token') : null
      this.socketService.sendMsg(this.env.enums.IdDataSocket.INFO, { access_token, contratoId: this.authService.getContrato().id, usuarioDeviceId: await this.usuarioDeviceService.getUsuarioDeviceId(this.usuarioLogado.id) })

      const currentUrl = this.router.routerState.snapshot.url; // event.url
      setTimeout(() => {
        this.socketService.sendMsg(this.env.enums.IdDataSocket.PAGE, { currentTitle: document.title.replace(' - ' + this.env.infos?.appName, ''), currentUrl })
      }, 1000)

    })

    this.showAceiteCookies = false && !await this.storageService.get('cookiesAceitos')

    this.tutorialPWAShowed = this.platform.is('capacitor') || this.platform.is('pwa') || (this.platform.is('desktop') && !navigator.userAgent.toLowerCase().includes('chrome')) ||
      navigator.userAgent.toLowerCase().includes('prerender') || navigator.userAgent.toLowerCase().includes('firefox') || await this.storageService.get('tutorialPWAShowed') ||
      location.pathname === '/' // Site

    // LogRocket.getSessionURL(function (sessionURL) {
    //     ga('send', {
    //         hitType: 'event',
    //         eventCategory: 'LogRocket',
    //         eventAction: sessionURL,
    //     });
    // });

    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // toggleDarkTheme(prefersDark.matches); // boolean
    // prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

    if (isNative) {

      // const token = await this.pushService
      //   .pushStart((tokenRefreshed) => {
      //     this.dataService.set('FCM_TOKEN', tokenRefreshed);
      //   })
      //   .catch((error) => {
      //     // this.appUtil.alertError(error);
      //   });

      // this.dataService.set('FCM_TOKEN', token);

      // this.pushService.pushListen().subscribe((notification) => {
      //   this.pushReceive(notification);
      // });

    }

  }


  pushModal() {



  }

  async pushReceive(notification) {
    if (notification.routerPath) {
      this.pushForward(notification);
    } else {
      this.appUtil.alertMessage({
        header: notification.title,
        message: notification.message,
      });
    }
  }

  async pushForward(notification) {
    if (notification.tap === 'background') {
      this.router.navigateByUrl(notification.routerPath);
    } else {
      (
        await this.alertCtrl.create({
          header: notification.title,
          message: notification.message,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Visualizar',
              handler: async () => {
                (await this.modalCtrl.getTop())?.dismiss();
                this.router.navigateByUrl(notification.routerPath);
              },
            },
          ],
        })
      ).present();
    }
  }

}
