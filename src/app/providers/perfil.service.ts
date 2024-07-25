import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  BackendService,
  IBasicBodyData,
  IBasicEntityData,
  IBasicFiltersData,
  IBasicReturnData,
  IFileData
} from '../abstracts/backend-service.abstract'
import { AppUtil } from '../app-util'

const BASE_PATH = 'perfil'

@Injectable({
  providedIn: 'root'
})
export class PerfilService extends BackendService {

  constructor(public http: HttpClient, public appUtil: AppUtil) {

    super()

  }

  downloadExportacao(filters?: IBasicFiltersData): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/downloadExportacao'

    const params = { filters: JSON.stringify(filters) }

    return this.http.get<IBasicBodyData>(url, { params })

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

  uploadImportacao(data: IFileData): Observable<IBasicReturnData> {

    const url = BASE_PATH + '/uploadImportacao'

    return this.http.post(url + '', data)

  }

  save(perfil: IBasicBodyData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    let req: Observable<any>

    if (perfil['perfil'].id) {

      req = this.http.put(url + '/' + perfil['perfil'].id, perfil)

    } else {

      req = this.http.post(url + '', perfil)
    }

    return req

  }

  delete(perfis: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData> {

    let ids: number[] = []

    if (perfis instanceof Array) {
      ids = perfis.map(fp => fp.id!) // [obj, obj, obj] -> [3, 7, 22]
    } else {
      ids = [perfis.id!]
    }

    const url = BASE_PATH + '/bulk/' + ids.join(',')

    let params: any = {}

    return this.http.delete(url, { params })

  }

}
