import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/providers/auth.service';
import { MessageService } from 'src/app/providers/message.service';
import { environment } from 'src/environments/environment';

import { HeaderComponent } from '../header/header.component';
import { TaskbarItem, TaskbarService } from './taskbar.service';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss'],
})
export class TaskbarComponent {

  environment = environment

  usuarioLogado: any

  taskbarId: string

  itens: TaskbarItem[] = []

  subscriptions: Subscription[] = []

  constructor(
    public authService: AuthService,
    private messageService: MessageService,
    private taskbarService: TaskbarService,
  ) {

    this.usuarioLogado = this.authService.getAuth()

    this.subscriptions.push(this.messageService.get<HeaderComponent>('modal.create').subscribe(data => {

      if (data.minimizable && this.taskbarId === data.taskbarId) {

        setTimeout(() => {

          const item: TaskbarItem = {
            taskbarItemId: data.taskbarItemId,
            that: data,
            title: data.appTitle,
            subtitle: data.appSubtitle,
            cssClass: 'animated bounceInUp duration-500'
          }

          this.taskbarService.add(item)

          this.setTaskbarItens()

        }, 500)

      }

    }))

    this.subscriptions.push(this.messageService.get<HeaderComponent>('modal.minimize').subscribe(data => {

      const item = this.taskbarService.find(data.taskbarItemId)

      if (item) {
        item.cssClass = 'animated pulse duration-300'
        setTimeout(() => {
          item.cssClass = ''
        }, 300)
      }

    }))

    this.subscriptions.push(this.messageService.get<HeaderComponent>('modal.destroy').subscribe(async data => {

      const item = this.taskbarService.find(data.taskbarItemId)

      if (item) {

        if (item.that.taskbarId === this.taskbarId) {

          await this.taskbarService.remove(item.taskbarItemId)
          this.setTaskbarItens()

        }

      }

    }))

  }

  async ngOnInit() {

    this.taskbarId = location.pathname

    this.setTaskbarItens()

  }

  ngOnDestroy() {

    this.subscriptions.forEach(s => s.unsubscribe())

  }

  setTaskbarItens() {

    setTimeout(() => {
      this.itens = this.taskbarService.get(this.taskbarId)
    })

  }

  showModal(item: TaskbarItem) {

    this.messageService.get('modal.show').next(item.that)

  }

}
