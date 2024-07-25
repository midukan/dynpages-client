import { FiltersSelectDatas } from '../components/filters/filters.component'

export abstract class PageService {

  abstract modalForm(filtersSelectDatas?: FiltersSelectDatas, origem?: any, ...extras: any[]): Promise<any>
  abstract modalForm(filtersSelectDatas?: FiltersSelectDatas, entity?: any, ...extras: any[]): Promise<any>

  abstract modalList(filters?: any): Promise<any>

  abstract navigate(filtersSelectDatas?: FiltersSelectDatas, filters?: any): Promise<any>

}
