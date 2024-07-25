import { Observable, Subject } from 'rxjs'

export interface IBasicBodyData {
  [property: string]: IBasicEntityData
}

export interface IBasicFiltersData {
  pager: { skip?: number, take?: number, offset?: number, limit: number }
  [property: string]: any
}

export interface IFileData { file: { dataUpload: string, dataNome: string } }
export interface IBodyFile { data: string, mimetype: string, filename?: string }

export interface IBasicReturnData {
  title?: string
  message?: string
  file?: IBodyFile
  [property: string]: IBasicEntityData | IBasicEntityData[] | any
}

export interface IBasicEntityData {
  id?: number | null
  [property: string]: any | string | number | boolean | null | undefined
}

export abstract class BackendService {

  entityUpdated: Subject<IBasicReturnData | null> = new Subject() // form -> list
  entityFormUpdate: Subject<IBasicReturnData | null> = new Subject() // list -> form
  entityChanger: Subject<{ id: number, direction: 'PREV' | 'NEXT' }> = new Subject()
  setState: Subject<any> = new Subject()

  abstract getOne(id: number): Observable<IBasicReturnData>

  abstract getMany(filters?: IBasicFiltersData): Observable<IBasicReturnData>

  abstract save(data: IBasicBodyData): Observable<IBasicReturnData>

  downloadExportacao?(filters?: IBasicFiltersData): Observable<IBasicReturnData> {
    throw new Error('Method not implemented.')
  }

  uploadImportacao?(data: IFileData): Observable<IBasicReturnData> {
    throw new Error('Method not implemented.')
  }

  abstract delete(entities: IBasicEntityData | IBasicEntityData[]): Observable<IBasicReturnData>

}
