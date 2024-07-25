import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom, Observable } from 'rxjs'

import {
  BackendService,
  IBasicBodyData,
  IBasicEntityData,
  IBasicFiltersData,
  IBasicReturnData
} from '../abstracts/backend-service.abstract'
import { AppUtil } from '../app-util'
import { StorageService } from './storage.service'
import { WebPushService } from './web-push.service'

export interface IUsuarioDevice {
  id: number
  usuarioId: number
}

const BASE_PATH = 'usuario-device'

@Injectable({
  providedIn: 'root'
})
export class UsuarioDeviceService extends BackendService {

  tokenSent = false

  constructor(
    public http: HttpClient,
    public appUtil: AppUtil,
    private webPushService: WebPushService,
    private storageService: StorageService,
  ) {

    super()

  }

  async getUsuarioDevices(): Promise<IUsuarioDevice[]> {
    return (await this.storageService.get('usuarioDevices')) || []
  }

  async getUsuarioDevice(usuarioId: number): Promise<IUsuarioDevice | null> {
    const usuarioDevices = await this.getUsuarioDevices()
    return usuarioDevices.find(usuarioDevice => usuarioDevice.usuarioId === usuarioId) || null
  }

  async getUsuarioDeviceId(usuarioId: number): Promise<number | null> {
    return (await this.getUsuarioDevice(usuarioId))?.id || null
  }

  async setUsuarioDevice(usuarioDevice: IUsuarioDevice): Promise<void> {
    const usuarioDevices = await this.getUsuarioDevices()
    const usuarioDeviceFind = usuarioDevices.find(ud => ud.usuarioId === usuarioDevice.usuarioId) // tem que ser assim por conta do assign
    const { id, usuarioId } = usuarioDevice
    if (!usuarioDeviceFind) {
      usuarioDevices.push({ id, usuarioId })
    } else {
      Object.assign(usuarioDeviceFind, { id, usuarioId })
    }
    await this.storageService.set('usuarioDevices', usuarioDevices)
  }

  async delUsuarioDevice(usuarioDeviceId: number): Promise<void> {
    const usuarioDevices = await this.getUsuarioDevices()
    const idx = usuarioDevices.findIndex(ud => ud.id === usuarioDeviceId)
    if (idx >= 0) {
      usuarioDevices.splice(idx, 1)
      await this.storageService.set('usuarioDevices', usuarioDevices)
    }
  }

  async generateAndSaveDevice(usuarioId: number) {

    let usuarioDeviceId = await this.getUsuarioDeviceId(usuarioId)

    if (usuarioDeviceId && location.protocol === 'https:') {

      this.webPushService.tokenReceived().subscribe(async sub => {
        this.tokenActions(sub, usuarioDeviceId)
      })

      this.webPushService.pushStart().then(sub => {
        this.tokenActions(sub, usuarioDeviceId)
      })
      // .catch(err => console.log("Não foi possível assinar para receber notificações na inicialização."))

      // setInterval(() => {

      //   this.webPushService.pushStart().then(sub => {
      //     this.tokenActions(sub, usuarioDeviceId)
      //   })
      //   .catch(err => console.log("Não foi possível assinar para receber notificações na inicialização."))

      // }, 5000)

    }

  }

  private async tokenActions(sub: any, usuarioDeviceId: number | null) {

    if (!sub) return

    // console.log('Web Push Token recebido: ', sub)

    // estava enviando duplicado em sequência
    if (this.tokenSent) {
      // console.log('WebPush token recebido duplicado')
      return
    }
    this.tokenSent = true
    // libera para receber novas atualizações de token (desativar e ligar)
    setTimeout(() => {
      this.tokenSent = false
    }, 1000)

    // resolve o problema de ByteArray no .options
    sub = this.appUtil.deepCopy(sub, 'v1')

    const usuarioDevice = {
      id: usuarioDeviceId,
      webPushEndpoint: sub.endpoint,
      pushKey1: sub.keys.auth,
      pushKey2: sub.keys.p256dh
    }

    await firstValueFrom(this.save({ usuarioDevice }))
      .catch(err => {
        if (usuarioDevice.id) {
          this.delUsuarioDevice(usuarioDevice.id) // porque deletaria o device local? aparentemente fica fazendo com que sempre gere um novo device
        }
      })

  }

  getOne(id: number): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/' + id

    const params = {}

    return this.http.get(url, { params })

  }

  getMany(filters?: IBasicFiltersData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    const params = { filters: JSON.stringify(filters) }

    return this.http.get<IBasicBodyData>(url, { params })

  }

  testarNotificacao(id: number): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/' + id + '/testarNotificacao'

    let req: Observable<any> = this.http.get(url)

    return req

  }

  save(usuarioDevice: IBasicBodyData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    let req: Observable<any>

    if (usuarioDevice['usuarioDevice'].id) {

      req = this.http.put(url + '/' + usuarioDevice['usuarioDevice'].id, usuarioDevice)

    } else {

      req = this.http.post(url + '', usuarioDevice)
    }

    return req

  }

  delete(usuarioDevices: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData> {

    let ids: number[] = []

    if (usuarioDevices instanceof Array) {
      ids = usuarioDevices.map(fp => fp.id!) // [obj, obj, obj] -> [3, 7, 22]
    } else {
      ids = [usuarioDevices.id!]
    }

    const url = BASE_PATH + '/bulk/' + ids.join(',')

    let params: any = {}

    return this.http.delete(url, { params })

  }

}
