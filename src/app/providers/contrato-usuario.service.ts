import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  BackendService,
  IBasicBodyData,
  IBasicEntityData,
  IBasicFiltersData,
  IBasicReturnData
} from '../abstracts/backend-service.abstract'
import { AppUtil } from '../app-util'

const BASE_PATH = 'contrato-usuario'

@Injectable({
  providedIn: 'root'
})
export class ContratoUsuarioService extends BackendService {

  constructor(public http: HttpClient, public appUtil: AppUtil) {

    super()

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

  getConvites(): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/getConvites'

    const params = {}

    return this.http.get<IBasicBodyData>(url, { params })

  }

  save(contratoUsuario: IBasicBodyData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    let req: Observable<any>

    if (contratoUsuario['contratoUsuario'].id) {

      req = this.http.put(url + '/' + contratoUsuario['contratoUsuario'].id, contratoUsuario)

    } else {

      req = this.http.post(url + '', contratoUsuario)
    }

    return req

  }

  aceitar(id: number): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/' + id + '/aceitar'

    let req: Observable<any> = this.http.put(url, {})

    return req

  }

  delete(contratoUsuarios: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData> {

    let ids: number[] = []

    if (contratoUsuarios instanceof Array) {
      ids = contratoUsuarios.map(fp => fp.id!) // [obj, obj, obj] -> [3, 7, 22]
    } else {
      ids = [contratoUsuarios.id!]
    }

    const url = BASE_PATH + '/bulk/' + ids.join(',')

    let params: any = {}

    return this.http.delete(url, { params })

  }

  deleteViaPerfil(perfilId?: number): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/perfil/' + perfilId

    let params: any = {}

    return this.http.delete(url, { params })

  }

}
