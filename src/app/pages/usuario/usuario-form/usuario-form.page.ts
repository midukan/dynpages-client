import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IonInput, IonPopover, LoadingController, ModalController, NavController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { MessageService } from 'src/app/providers/message.service'
import { MiscService } from 'src/app/providers/misc.service'
import { StorageService } from 'src/app/providers/storage.service'
import { UsuarioService } from 'src/app/providers/usuario.service'
import { environment } from 'src/environments/environment'

import { DataService } from 'src/app/providers/data.service'
import { SocketService } from 'src/app/providers/socket.service'
import { ContratoPageService } from '../../interno/contrato/contrato-page.service'
import { OTPModalPageService } from '../../interno/otp/otp-page.service'
import { UsuarioPageService } from '../usuario-page.service'

@Component({
  selector: 'app-usuario-form-page',
  templateUrl: './usuario-form.page.html',
  styleUrls: ['./usuario-form.page.scss']
})
export class UsuarioFormPage extends FormPage {

  tela: 'default' | 'senha' | 'config' | 'seguranca' = 'default'

  usuarioDefault: any = {
    nome: '',
    ativo: true,
    localCadastro: environment.enums.UsuarioLocalCadastro.DEFAULT
  }
  usuario: any

  showPrevNext = location.pathname.includes('/usuario/')

  darkModes = Object.entries(environment.enums.UsuarioDarkModeStr).map(pt => ({ label: environment.enums.UsuarioDarkModeStr[pt[0]], value: pt[0] }))

  @ViewChildren(IonInput) ionInputs: QueryList<IonInput>

  @ViewChild('avisoValidaEmailPop') avisoValidaEmailPop: IonPopover

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    private messageService: MessageService,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    protected usuarioService: UsuarioService,
    private miscService: MiscService,
    private contratoPageService: ContratoPageService,
    protected element: ElementRef,
    private contratoService: ContratoService,
    private storageService: StorageService,
    protected socketService: SocketService,
    private otpModalPageService: OTPModalPageService,
    protected usuarioPageService: UsuarioPageService,
    public dataService: DataService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, usuarioService, usuarioPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Usuário', 'usuario')

    if (this.authService.isAuth() && this.router.url.split('/')[1] === 'criar-conta') {
      this.router.navigateByUrl(this.env.paths.isAuthUrlAdmin)
      return
    }

    if (this.router.url.split('/')[1] === 'painel') {
      this.usuarioDefault.localCadastro = environment.enums.UsuarioLocalCadastro.PAINEL
    } else {
      const utm = await this.storageService.get('utm')
      Object.assign(this.usuarioDefault, utm)
    }

    if (this.params?.tela || this.state?.tela) {
      this.tela = this.params?.tela || this.state?.tela
    } else if (this.routeData.recuperandoSenha) {
      this.tela = 'senha'
      this.state.usuario = this.appUtil.deepCopy(this.usuarioLogado)
    }

    // if (!this.state.usuario && this.authService.isAuth()) {
    // para editar a si mesmo, enviar como parâmetro
    // this.state.usuario = this.appUtil.deepCopy(this.usuarioLogado)
    // }

    if (this.state.usuario?.id) { // se for edição

      this.usuario = this.appUtil.deepCopy(this.state.usuario)

      if (this.usuario.id === this.usuarioLogado.id) {
        this.subtitle = 'Alterando meus dados.'
      } else {
        // this.subtitle = '<b>' + this.state.usuario.nomeCompleto + '</b>'
      }

    } else { // se for inclusão

      this.usuario = this.appUtil.deepCopy(this.usuarioDefault)

      if (this.authService.isAuth()) {
        this.subtitle = 'Incluindo um novo usuario.'
      } else {
        this.title = 'Criar conta'
        this.subtitle = 'Criando nova conta.'
      }

    }

    if (this.tela === 'senha') {
      this.title = 'Senha'
      this.subtitle = 'Altere sua senha.'
    } else if (this.tela === 'config') {
      this.title = 'Ajustes'
      this.subtitle = 'Configurações da conta.'
    } else if (this.tela === 'seguranca') {
      this.title = 'Segurança'
      this.subtitle = 'Configurações de autenticação.'
    }

    // this.setTitle(this.title, this.subtitle)

    this.usuario._estadoId = this.usuario.enderecoCidade?.estadoId
    this.setEnderecoCidadeSelectData()

    // Gambiarra pra limpar a senha do campo (aparentemente só no FF)
    this.usuario.senha = '_'
    setTimeout(() => this.usuario.senha = '', 500)

    setTimeout(() => {

      (window as any).prerenderReady = true

    }, 2000) // Por garantia

  }

  setFiltersSelectData() {

  }

  async refazer2FA() {

    const loading = await this.loadingCtrl.create({ message: 'Refazendo...' })
    loading.present()

    this.authService.otpDisable()
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: async data => {

          this.dismiss()

          await this.authService.logout()
          this.navCtrl.navigateRoot(environment.paths.noAuthUrl)

        }, error: err => this.appUtil.alertError(err)
      })

  }

  async salvar() {

    const loading = await this.loadingCtrl.create({ message: 'Salvando...' })
    loading.present()

    this.usuarioService.save({ usuario: this.usuario })
      .pipe(finalize(() => {
        loading.dismiss()
      }))
      .subscribe({
        next: async data => {

          this.appUtil.toast(
            this.usuario.id ? 'Alterado com sucesso.' : 'Criado com sucesso.',
            this.usuario.id ? 2000 : 2000, 'success')

          const loginData = {
            email: this.usuario.email,
            senha: this.usuario.senha,
          }

          if (data.usuario.id === this.usuarioLogado.id) {
            this.authService.auth(this.usuario.senha ? loginData : null).subscribe(() => {
              this.usuarioService.entityUpdated.next(data.usuario) // garante ações após update do logado no svc
            })
          }

          this.usuarioService.entityUpdated.next(data.usuario)

          if (this.usuario.id) { // Alteração

            if (this.routeData.recuperandoSenha) {

              const loading = await this.loadingCtrl.create({ message: 'Acessando...' })
              loading.present()

              this.authService.auth(loginData).pipe(
                finalize(() => {
                  loading.dismiss()
                })
              )
                .subscribe({
                  next: async data => {

                    this.otpActions(loginData, data, loading, () => {
                      this.contratoPageService.posAuthAction(data.usuario)
                    })

                  }, error: err => this.appUtil.alertError(err)
                })

            } else if (this.isModal) {
              this.dismiss({
                usuario: data.usuario
              })
            }

          } else { // Criação

            if (this.isModal) {

              this.dismiss({
                usuario: data.usuario
              })

            } else { // Criação no site

              const loading = await this.loadingCtrl.create({ message: 'Acessando...' })
              loading.present()

              this.authService.auth(loginData).pipe(
                finalize(() => {
                  loading.dismiss()
                })
              )
                .subscribe({
                  next: async data => {

                    this.otpActions(loginData, data, loading, () => {
                      this.continuaCadastro(loading, loginData, data)
                    })

                  }, error: err => {
                    loading.dismiss()
                    this.appUtil.alertError(err)
                  }
                })

            }

          }

        }, error: err => {

          this.errors = err.message

          if (!this.usuario._estadoId) {
            this.errors.push({
              property: 'usuario._estadoId',
              text: 'Deve estar preenchido.'
            })
          }

          if (typeof err.message === 'string') this.appUtil.alertError(err)

        }
      })

  }

  private async otpActions(loginData, data, loading, callback: Function) {

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

          callback()

        }

      })

      return

    }

    callback()

  }

  private continuaCadastro(loading: any, loginData: any, data: any) {

    // Todo: poderia fazer isso no back, assim como cria contrato default
    // Precisa de ajustes pois tem novos campos
    if (this.env.configs.APP_MULT_AMB && this.env.configs.NOVA_CONTA_CRIA_CONTRATO) {

      const contrato = {
        contrato: {
          tipo: 'PF',
          nome: data.usuario.nome + ' ' + data.usuario.sobrenome,
          fantasia: 'Ambiente de ' + data.usuario.nome,
          documento: data.usuario.documento,
        }
      }

      this.contratoService.save(contrato).subscribe({
        next: data => {

          this.authService.auth(loginData).pipe(
            finalize(() => {
              loading.dismiss()
            })
          )
            .subscribe({
              next: async data => {

                this.contratoPageService.posAuthAction(data.usuario)

              }, error: err => this.appUtil.pageRequestError(err)
            })

        }, error: err => {
          loading.dismiss()
          this.appUtil.alertError(err)
        }
      })

    } else {

      this.contratoPageService.posAuthAction(data.usuario, this.dataService.get('plano.selected') !== null)

    }

  }

  async reenviarLinkValidacao() {

    this.avisoValidaEmailPop.dismiss()

    const loading = await this.loadingCtrl.create({ message: 'Reenviando...' })
    loading.present()

    this.authService.reenviarEmailValidacao()
      .pipe(finalize(() => {
        loading.dismiss()
      }))
      .subscribe({
        next: async data => {

          this.appUtil.toast('Reenvio realizado. Verifique sua caixa de email.', 3000, 'success')

        },
        error: err => this.appUtil.alertError(err)
      })

  }

  cameraClick() {

    this.appUtil.uploadSelect(this.usuario, 'fotoUsuario', '.jpg', undefined, this.env.configs.FOTO_MAX_WIDTH, this.env.configs.FOTO_MAX_HEIGHT, this.env.configs.FOTO_QUALITY)
      .catch(err => this.appUtil.alertError(err))

  }

  estadoChange() {

    this.usuario.enderecoCidade = null
    this.usuario.enderecoCidadeId = null
    this.setEnderecoCidadeSelectData()

  }

  voltarParaLogin() {

    if (history.state.navigationId > 1) {
      this.navCtrl.pop()
    } else {
      this.navCtrl.navigateBack('/auth')
    }

  }

  private setEnderecoCidadeSelectData() {

    this.usuario.enderecoCidadeSelectData = { text: this.usuario.enderecoCidade?.nomeCompleto || 'Selecione', id: this.usuario.enderecoCidadeId }

  }

}
