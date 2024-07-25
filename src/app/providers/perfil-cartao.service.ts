import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BackendService,
  IBasicBodyData,
  IBasicEntityData,
  IBasicFiltersData,
  IBasicReturnData,
} from '../abstracts/backend-service.abstract';
import { AppUtil } from '../app-util';

const BASE_PATH = 'perfil-cartao'

@Injectable({
  providedIn: 'root'
})
export class PerfilCartaoService extends BackendService {

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

  save(perfilCartao: IBasicBodyData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    let req: Observable<any>

    if (perfilCartao['perfilCartao'].id) {

      req = this.http.put(url + '/' + perfilCartao['perfilCartao'].id, perfilCartao)

    } else {

      req = this.http.post(url + '', perfilCartao)
    }

    return req

  }

  delete(perfilCartoes: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData> {

    let ids: number[] = []

    if (perfilCartoes instanceof Array) {
      ids = perfilCartoes.map(fp => fp.id!) // [obj, obj, obj] -> [3, 7, 22]
    } else {
      ids = [perfilCartoes.id!]
    }

    const url = BASE_PATH + '/bulk/' + ids.join(',')

    let params: any = {}

    return this.http.delete(url, { params })

  }

}
