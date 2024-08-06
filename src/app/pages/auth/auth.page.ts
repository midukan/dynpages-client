import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertController, IonContent, LoadingController, ModalController, NavController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs/operators'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'

import { DataService } from 'src/app/providers/data.service'
import { ContratoPageService } from '../interno/contrato/contrato-page.service'
import { OTPModalPageService } from '../interno/otp/otp-page.service'
import { UsuarioPageService } from '../usuario/usuario-page.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage extends BasePage {

  tela: 'login' | 'recuperar-senha' = 'login'

  email = ''
  senha = ''

  recaptchaToken: string | undefined;
  showRecaptcha = false

  @ViewChild(IonContent) content: IonContent

  @ViewChild('inputEmail') inputEmail: any
  @ViewChild('inputSenha') inputSenha: any

  constructor(
    public navCtrl: NavController,
    public appUtil: AppUtil,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public messageService: MessageService,
    public platform: Platform,
    public modalCtrl: ModalController,
    private contratoPageService: ContratoPageService,
    private usuarioPageService: UsuarioPageService,
    protected element: ElementRef,
    private otpModalPageService: OTPModalPageService,
    private dataService: DataService,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

    this.tela = location.pathname.split('/')[1] === 'recuperar-senha' ? 'recuperar-senha' : this.tela

  }

  async ngOnInit() {

    await this.ngOnInitDefault()

    setTimeout(() => {

      (window as any).prerenderReady = true

    }, 2000) // Por garantia

  }

  async ionViewDidEnter() {

    await this.ionViewDidEnterDefault()

    this.appUtil.setFocus(this.inputEmail)

  }

  async efetuaLogin() {

    const loginData = {
      email: this.email,
      senha: this.senha,
      recaptchaToken: this.recaptchaToken,
    }

    this.recaptchaToken = undefined

    const loading = await this.loadingCtrl.create({ message: 'Efetuando login...' })
    loading.present()

    this.authService.auth(loginData).pipe(
      finalize(() => {
        loading.dismiss()
      })
    )
      .subscribe({
        next: async data => {

          if (data.otp?.tipo === 'OTP_MISSING' || data.otp?.tipo === 'OTP_FAIL') {

            const modal = await this.otpModalPageService.modal(data.otp)

            modal.onDidDismiss().then(async dataModal => {

              if (dataModal?.data?.success) {

                if (this.isModal) {
                  this.dismiss()
                }

                await this.authService.loadAuthContrato()
                  .catch(err => {
                    this.authService.logout(true)
                    this.appUtil.alertError(err)
                    this.router.navigateByUrl(this.env.paths.noAuthUrl)
                  })

                this.contratoPageService.posAuthAction(data.usuario)

              }

            })

            return

          }

          if (this.isModal) {
            this.dismiss()
          }

          this.contratoPageService.posAuthAction(data.usuario)

        }, error: err => {

          this.authService.logout() // para remover o otp_token pendente também

          if (err.tipo === 'senhaIncorreta') {

            this.appUtil.alertError(err, {}, () => {
              setTimeout(() => {
                this.inputSenha.setFocus()
              }, 500)
            })

          } else if (err.tipo === 'efetuaLogin') {

            this.tela = 'login'

          } else if (err.tipo === 'usuario') {

            // this.usuario()

          } else if (err.tipo === 'recaptcha') {

            this.showRecaptcha = err.showRecaptcha
            this.appUtil.alertError(err)

          } else {

            this.appUtil.alertError(err)

          }

        }
      })

  }

  ajustaCPF() {

    if ((this.email + '').length === 11 && this.appUtil.validaCPF(this.email)) {

      this.email = this.email.substring(0, 3) + '.' + this.email.substring(3, 6) + '.' + this.email.substring(6, 9) + '-' + this.email.substring(9, 11)

    }

  }

  async criarConta() {

    this.dataService.set('plano.selected', 1)
    this.dataService.set('planoPeriodo.selected', 'MENSAL')

    this.usuarioPageService.navigate()

  }

  recuperarConta() {

    if (!this.email) {

      this.alertCtrl.create({
        header: 'Ops!',
        message: 'Preencha o email para continuar.',
        buttons: ['Ok']
      }).then(a => a.present())

      return

    }

    const loading = this.loadingCtrl.create({ message: 'Aguarde...' })
    loading.then(a => a.present())

    this.authService.recuperarSenha(this.email)
      .pipe(
        finalize(() => {
          this.loadingCtrl.dismiss()
        })
      )
      .subscribe({
        next: data => {

          this.appUtil.alertMessage('Enviamos um email com instruções para recuperação da sua senha.')

          this.tela = 'login'

        }, error: err => {

          this.appUtil.pageRequestError(err, 'alert')

        }
      })

  }

  teclaLogin() {

    this.tela = 'login'

    setTimeout(() => {
      this.messageService.get('modal.resize').next(null)
    }, 100)

  }

  telaRecSenha() {

    this.tela = 'recuperar-senha'

    setTimeout(() => {
      this.messageService.get('modal.resize').next(null)
    }, 100)

  }

  dismiss() {

    this.modalCtrl.dismiss(null, 'close')

  }

}
