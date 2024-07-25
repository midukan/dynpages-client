import { Pipe, PipeTransform } from '@angular/core'

import { AppUtil } from '../app-util'

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  constructor(public appUtil: AppUtil) {


  }

  transform(items: any[], fields: string[], value: any, not = false): any[] {

    if (!items) {
      return []
    }

    if (!fields?.length || value === undefined) {
      return items
    }

    const valueSplit = (value + '').split(' ')

    const itemsResult = items.filter(item => {

      let searchString: any = ''

      fields.forEach(field => {

        let data: any = field.split('.').reduce((prevData, curProp) => prevData ? prevData[curProp] : undefined, item)

        if (typeof value === 'boolean' || typeof value === 'number' || value === undefined || value === null) {
          searchString = (data === value)
          return
        }

        if (typeof data === 'number') {
          data = data.toString()
        }

        searchString += data.toLowerCase() + ' '

      })

      if (typeof searchString === 'boolean') {
        return searchString
      }

      if (not) {
        return !valueSplit.filter(val => searchString.includes(val.toLowerCase())).length
      } else {
        return valueSplit.filter(val => searchString.includes(val.toLowerCase())).length === valueSplit.length
      }

    })

    return itemsResult

  }

}
