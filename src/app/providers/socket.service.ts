import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket, private storageService: StorageService) {

  }

  init() {

  }

  onConnect(callback = () => { }) {
    this.socket.on('connect', (data) => {
      callback()
    })
  }

  onDisconnect(callback = () => { }) {
    this.socket.on('disconnect', (data) => {
      callback()
    })
  }

  getMsg(id: typeof environment.enums.IdDataSocket[keyof typeof environment.enums.IdDataSocket]): Observable<any> {

    return this.socket.fromEvent('client.' + id)
      .pipe(map(a => {

        const jsonParse = a

        if (environment.name !== 'production' && id !== environment.enums.IdDataSocket.ADMIN_STATS && id !== environment.enums.IdDataSocket.SERVER_INFO && id !== environment.enums.IdDataSocket.PAGE) {
          console.log('Socket Receive:', id, jsonParse)
        }

        return jsonParse

      }))

  }

  async sendMsg(id: typeof environment.enums.IdDataSocket[keyof typeof environment.enums.IdDataSocket], data: any = {}) {

    let uuid = await this.storageService.get('wsinfo');

    if (uuid) {
      data['uuid'] = uuid;
    }

    if (environment.name !== 'production' && id !== environment.enums.IdDataSocket.PAGE && id !== environment.enums.IdDataSocket.INFO) {
      console.log('Socket Send:', id, data)
    }

    this.socket.emit('server.' + id, data)

  }

}
