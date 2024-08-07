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

const BASE_PATH = 'projeto'

@Injectable({
  providedIn: 'root'
})
export class ProjetoService extends BackendService {

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

  save(projeto: IBasicBodyData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    let req: Observable<any>

    if (projeto['projeto'].id) {

      req = this.http.put(url + '/' + projeto['projeto'].id, projeto)

    } else {

      req = this.http.post(url + '', projeto)
    }

    return req

  }

  delete(projetos: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData> {

    let ids: number[] = []

    if (projetos instanceof Array) {
      ids = projetos.map(fp => fp.id!) // [obj, obj, obj] -> [3, 7, 22]
    } else {
      ids = [projetos.id!]
    }

    const url = BASE_PATH + '/bulk/' + ids.join(',')

    let params: any = {}

    return this.http.delete(url, { params })

  }

}
