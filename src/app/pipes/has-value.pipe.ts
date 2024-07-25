import { Pipe, PipeTransform } from '@angular/core';
import { AppUtil } from '../app-util'

@Pipe({
  name: 'hasValue',
  pure: false
})
export class HasValuePipe implements PipeTransform {

  constructor(public appUtil: AppUtil) {


  }

  transform(items: any[], fields: string[], hasValue = true): any[] {

    if (!items) {
      return []
    }

    const itemsResult = items.filter(item => {

      let returnOk = true

      fields.forEach(field => {

        if (hasValue && !item[field]) {
          returnOk = false
        }
        if (!hasValue && item[field]) {
          returnOk = false
        }

      })

      return returnOk

    })

    return itemsResult

  }

}
