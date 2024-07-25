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

const BASE_PATH = 'usuario'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BackendService {

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

  // todo: remover forceParceiro
  saveSite(usuario: IBasicBodyData): Observable<IBasicReturnData> { // , forceParceiro = false

    const url = BASE_PATH + '/save-site'

    let req: Observable<any>

    if (usuario['usuario'].id) {

      req = this.http.put(url + '/' + usuario['usuario'].id, usuario)

    } else {

      // req = this.http.post(url + (forceParceiro ? '?p=1' : ''), usuario)
      req = this.http.post(url, usuario)
    }

    return req

  }

  save(usuario: IBasicBodyData): Observable<IBasicReturnData> {

    const url = BASE_PATH

    let req: Observable<any>

    if (usuario['usuario'].id) {

      req = this.http.put(url + '/' + usuario['usuario'].id, usuario)

    } else {

      req = this.http.post(url + '', usuario)
    }

    return req

  }

  delete(usuarios: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData> {

    let ids: number[] = []

    if (usuarios instanceof Array) {
      ids = usuarios.map(fp => fp.id!) // [obj, obj, obj] -> [3, 7, 22]
    } else {
      ids = [usuarios.id!]
    }

    const url = BASE_PATH + '/bulk/' + ids.join(',')

    let params: any = {}

    return this.http.delete(url, { params })

  }

}
