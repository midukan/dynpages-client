import { Injectable } from '@angular/core';

import { HeaderComponent } from '../header/header.component';

export type TaskbarItem = {
  taskbarItemId: number
  title: string
  subtitle: string
  that: HeaderComponent
  cssClass?: string
}

@Injectable({
  providedIn: 'root'
})
export class TaskbarService {

  private itens: TaskbarItem[] = []

  add(item: TaskbarItem) {

    this.itens.push(item)

  }

  get(taskbarId: string) {

    return this.itens.filter(item => item.that.taskbarId === taskbarId)

  }

  find(taskbarItemId: number) {

    return this.itens.find(item => item.taskbarItemId === taskbarItemId)

  }

  async remove(taskbarItemId: number) {

    return new Promise((resolve, reject) => {

      const idx = this.itens.findIndex(item => item.taskbarItemId === taskbarItemId)

      if (idx >= 0) {

        this.itens[idx].cssClass = 'animated bounceOutDown duration-500'

        setTimeout(() => {
          this.itens[idx].cssClass = ''
          this.itens.splice(idx, 1)
          resolve(null)
        }, 500)

      }

    })

  }

}
