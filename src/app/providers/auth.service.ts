import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Observable, firstValueFrom, tap } from 'rxjs'
import { environment } from 'src/environments/environment'

import * as LogRocket from 'logrocket'
import { AppUtil } from '../app-util'
import { ContratoService } from './contrato.service'
import { DataService } from './data.service'
import { MessageService } from './message.service'
import { SocketService } from './socket.service'
import { StorageService } from './storage.service'
import { UsuarioDeviceService } from './usuario-device.service'

const BASE_PATH = 'auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUsuario: any = {}
  private authContratos: any[] = []
  private authContrato: any = {}

  private access_token: string | undefined
  private otp_token: string | undefined

  constructor(
    public http: HttpClient,
    public appUtil: AppUtil,
    private storageService: StorageService,
    public dataService: DataService,
    private socketService: SocketService,
    private deviceDetectorService: DeviceDetectorService,
    private messageService: MessageService,
    private usuarioDeviceService: UsuarioDeviceService,
    private contratoService: ContratoService,
    protected loadingCtrl: LoadingController,
  ) {

    this.intervalUpdateToken()
    this.loadTokens()

  }

  private async loadTokens() {

    this.access_token = await this.storageService.get('access_token')
    this.otp_token = await this.storageService.get('otp_token')

  }

  private async intervalUpdateToken() {

    setInterval(() => {
      if (this.isAuth()) {
        this.auth().subscribe()
      }
    }, (1000 * 60 * 30)) // a cada 30 minutos

  }


  validaEmail(code: string): Observable<any> {

    const url = BASE_PATH + '/valida-email'

    const params = { code }

    return this.http.get(url, { params })

  }

  reenviarEmailValidacao(): Observable<any> {

    const url = BASE_PATH + '/reenviar-email-validacao'

    const params = {}

    return this.http.get(url, { params })

  }

  auth(dataLogin?: any): Observable<any> { // se for login e senha ou token fb (referencia só usa para cadastro)

    return new Observable(observer => {

      this.storageService.get('access_token').then(async logadoToken => {

        if (!dataLogin) {
          dataLogin = {
            // access_token: logadoToken 
          }
        }

        const usuarioDeviceId = await this.usuarioDeviceService.getUsuarioDeviceId(this.authUsuario.id)

        const usuarioDevice = {
          id: usuarioDeviceId,
          nome: this.deviceDetectorService.browser + ' - ' + this.deviceDetectorService.os + ' (' + this.deviceDetectorService.deviceType + ')',
          descricao: this.deviceDetectorService.userAgent
        }

        dataLogin.usuarioDevice = usuarioDevice
        dataLogin.usuarioDeviceIds = (await this.usuarioDeviceService.getUsuarioDevices()).map(ud => ud.id)

        this._loadAuth(dataLogin, observer)

      })

    })

  }

  private async _loadAuth(dataLogin: any, observer) {

    this.login(dataLogin)
      .subscribe({
        next: async data => {

          await this.setAuth(observer, data)

          const usuarioDeviceId = await this.usuarioDeviceService.getUsuarioDeviceId(this.authUsuario.id)
          this.socketService.sendMsg(environment.enums.IdDataSocket.INFO, {
            access_token: data.access_token || dataLogin.access_token,
            contratoId: this.getContrato().id,
            usuarioDeviceId
          })

          observer.next(data)
          observer.complete()

        },
        error: async err => {

          await this.setAuth(observer)

          observer.error(err)
          observer.complete()

        }
      })

  }

  async setAuth(observer, data: any = null) {

    if (data) {

      if (data.access_token) {

        this.access_token = data.access_token
        await this.storageService.set('access_token', data.access_token)

      }

      if (data.usuario) {

        this.appUtil.clearObj(this.authUsuario)
        Object.assign(this.authUsuario, data.usuario)

        LogRocket.identify(this.authUsuario.id, {
          name: this.authUsuario.nomeCompleto,
          documento: this.authUsuario.documento,
          email: this.authUsuario.email,
          telefone: this.authUsuario.telefone,
          celular: this.authUsuario.celular,
        })

        if (!data.otp) {
          await this.loadAuthContrato().catch(err => {
            observer.error(err)
            observer.complete()
            return
          })
        }
      }

      if (data.usuarioDevice) {

        await this.usuarioDeviceService.setUsuarioDevice(data.usuarioDevice)
        // this.usuarioDeviceService.generateAndSaveDevice(data.usuarioDevice)

      }

    } else {
      this.appUtil.clearObj(this.authUsuario)
    }

  }

  login(dataLogin: any): Observable<any> {

    // dataLogin.access_token = (!dataLogin.access_token ? '' : dataLogin.access_token)
    dataLogin.email = (!dataLogin.email ? '' : dataLogin.email)
    dataLogin.senha = (!dataLogin.senha ? '' : dataLogin.senha)
    dataLogin.recaptchaToken = (!dataLogin.recaptchaToken ? '' : dataLogin.recaptchaToken)
    dataLogin.usuarioDevice = (!dataLogin.usuarioDevice ? '' : dataLogin.usuarioDevice)
    dataLogin.usuarioDeviceIds = (!dataLogin.usuarioDeviceIds ? '' : dataLogin.usuarioDeviceIds)

    let url: string | null = null
    let params: any = {}
    let noClientRetry = false

    if (dataLogin.cpf || dataLogin.email) {

      url = 'auth/login'

      params.username = dataLogin.cpf || dataLogin.email
      params.password = dataLogin.senha
      params.recaptchaToken = dataLogin.recaptchaToken
      params.usuarioDevice = dataLogin.usuarioDevice
      params.usuarioDeviceIds = dataLogin.usuarioDeviceIds

    } else {

      url = 'auth/loged'

      // params.access_token = dataLogin.access_token
      params.usuarioDevice = dataLogin.usuarioDevice
      params.usuarioDeviceIds = dataLogin.usuarioDeviceIds

      noClientRetry = true

    }

    // if (!url) {
    //   return throwError(() => new Error('Preencha os campos para continuar.'))
    // }

    return this.http.post(url, params, { headers: new HttpHeaders({ noClientRetry: noClientRetry ? '1' : '0' }) })

    // OFFLINE CACHE
    // .pipe(
    //   tap(async data => await this.storageService.set('req.loginData', data)),
    //   catchError(async err => {
    //     const data = await this.storageService.get('req.loginData')
    //     if (data) return data
    //     throw err
    //   })
    // )

  }

  // otpCode(): Observable<any> {

  //   const url = BASE_PATH + '/otp-code'

  //   const params = {}

  //   return this.http.get(url, { params })

  // }

  otpSendEmail(): Observable<any> {

    const url = BASE_PATH + '/otp-send-email'

    const params = {}

    return this.http.get<any>(url, { params })

  }

  otpDisable(): Observable<any> {

    const url = BASE_PATH + '/otp-disable'

    const params = {}

    return this.http.get<any>(url, { params })

  }

  otpLogin(otp: any): Observable<any> {

    const url = BASE_PATH + '/otp-login'

    const params = {}

    return this.http.post<any>(url, otp)
      .pipe(tap(async data => {

        if (data.otp_token) {
          this.otp_token = data.otp_token
          await this.storageService.set('otp_token', data.otp_token)
        }

        this.usuarioDeviceService.generateAndSaveDevice(this.authUsuario.id) // só faz após validar OTP, pois sem token de otp esse request não é aceito

      }))

  }

  async logout(preserveOTPToken = false) {

    const usuarioDeviceId = await this.usuarioDeviceService.getUsuarioDeviceId(this.authUsuario.id)
    this.socketService.sendMsg(environment.enums.IdDataSocket.INFO, { usuarioDeviceId })

    this.appUtil.clearObj(this.authUsuario)
    this.appUtil.clearObj(this.authContrato)
    this.authContratos = []

    this.access_token = undefined
    this.otp_token = undefined

    await this.storageService.del('access_token')
    await this.storageService.del('req.loginData')

    if (!preserveOTPToken) {
      await this.storageService.del('otp_token')
    }

  }

  getAuth(): any {
    return this.authUsuario
  }

  isAuth(): boolean {
    return !!this.authUsuario.id
  }

  recuperarSenha(cpf: string): Observable<any> {
    const url = 'auth/recuperar-senha' // carregar usuário (usa Sessao)
    return this.http.get(url, { params: { cpf } })
  }

  getContratoUsuario(): any {
    return this.getContratoUsuarios()?.find(ep => ep.contratoId === this.authContrato.id)
  }

  getContratoUsuarios(): any[] {
    return this.authUsuario.contratoUsuarios
  }

  getContrato(): any {
    return this.authContrato
  }

  getContratos(): any {
    return this.authContratos
  }

  getAccessToken() {
    return this.access_token
  }

  getOTPToken() {
    return this.otp_token
  }

  async loadAuthContrato(force = false) {

    const splitUrl = location.pathname.split('/')
    const urlContratoId = !environment.configs.APP_MULT_AMB ? environment.configs.CONTRATO_ID_DEFAULT : +splitUrl[2]

    if (force || !this.authContrato || urlContratoId !== this.getContrato().id) {

      if (this.getAuth().isMasterAdmin) {

        if (!this.authContratos.length) {

          // const loading = await this.loadingCtrl.create({ message: 'Aguarde...' })
          // loading.present()
          const dataContratos = await firstValueFrom(this.contratoService.getMany({ pager: { limit: 0 } }))
          this.authContratos = dataContratos.contratos
          // loading.dismiss()

        } else {
          // const dataContratos = await firstValueFrom(this.contratoService.getMany({ pager: { limit: 0 } }))
          // this.authContratos = dataContratos.contratos
          this.contratoService.getMany({ pager: { limit: 0 } }).subscribe(data => {
            this.authContratos = data.contratos
          })
        }

      } else {
        this.authContratos = this.getContratoUsuarios()?.map((ep) => ep.contrato) || [] // pega o que veio no loged
      }

      if (urlContratoId) {
        const contrato = this.authContratos?.find((con) => con.id === urlContratoId) || this.authContratos[0]
        this.appUtil.clearObj(this.authContrato)
        if (contrato) {
          Object.assign(this.authContrato, contrato)
        }
      }

    }

  }

  hasPermission(cargo: string | string[] | 'master-admin', ignoreMaster = false, usuario?: any): boolean { // cargo 'master-admin' testa isMasterAdmin apenas

    const contratoId = this.getContrato().id

    if (!ignoreMaster && this.authUsuario.isMasterAdmin) {
      return true
    }

    if (cargo instanceof Array) {

      for (let c of cargo) {
        if (this.hasPermission(c)) return true
      }

      return false

    }

    return !!(usuario?.contratoUsuarios || this.getContratoUsuarios())?.some(ep => ep.cargo === cargo && (contratoId === 0 || ep.contratoId === contratoId))

  }

}
