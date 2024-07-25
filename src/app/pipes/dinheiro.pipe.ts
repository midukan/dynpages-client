import { Pipe, PipeTransform } from '@angular/core';
import { AppUtil } from '../app-util';

@Pipe({
  name: 'dinheiro',
})
export class DinheiroPipe implements PipeTransform {

  constructor(public appUtil: AppUtil) {


  }

  transform(value: number, ...args) {

    const decimals = (args[1] !== undefined) ? args[1] : 2

    return this.appUtil.dinheiro(value, args[0], decimals);

  }

}
