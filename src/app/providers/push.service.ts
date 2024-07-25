import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  public badge = 0;

  constructor(
    private platform: Platform,
    public http: HttpClient,
  ) {


  }

  async pushStart(): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      if (!this.platform.is('capacitor')) {
        resolve(false)
        return
      }

      PushNotifications.checkPermissions()
        .then(async hasPermission => {

          // if (hasPermission.receive == 'denied') {
          //     reject('Não temos permissão para enviar notificações, você precisa autorizar em ajustes do celular.')
          //     return
          // }

          // if (hasPermission.receive == 'granted') {
          //     this.pushTokenInit(onTokenRefresh)
          //     resolve(true)
          //     return
          // }

          if (hasPermission.receive == 'prompt' ||
            hasPermission.receive == 'granted') {
            await this.getPermission().catch(erro => reject(erro))
            resolve(true)
          }

        })
        .catch(async erro => {

          await this.getPermission().catch(erro => reject(erro))
          resolve(true)

        })

    })

  }

  tokenReceived(): Observable<any> {

    return new Observable((observer) => {

      PushNotifications.addListener('registration', (token: Token) => {
        observer.next(token.value)
      })

    })

  }

  notificationReceived(): Observable<any> {

    return new Observable((observer) => {

      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        observer.next(notification)
      })

    })

  }

  getPermission(): Promise<any> {

    return new Promise((resolve, reject) => {

      PushNotifications.requestPermissions()
        .then(async (permission) => {

          if (permission.receive == 'granted') {

            // Register with Apple / Google to receive push via APNS/FCM
            await PushNotifications.register()
            this.setChannel()

            resolve(true)
            return

          }

          // Clicou em "Não Permitir"
          // reject('X1 ~> Você precisa ativar as notificações em ajustes do celular se mudar de idéia.')

        })
        .catch(erro => {
          reject(erro)
        })

    })

  }

  setChannel() {

    // Android ~> Se não for nao existe channel
    if (!this.platform.is('android')) return

    // Android ~>
    //await PushNotifications.listChannels()

    // Android ~>
    //await PushNotifications.deleteChannel()

    // Android ~> somente para conseguir tocar o sound
    PushNotifications.createChannel({
      id: 'sound',
      name: 'Sound',
      description: 'SoundTest',
      sound: 'push.wav',  // Arquivo deve estar em "/res/raw/filiname.wav"
      importance: 3,
      visibility: 1,
      lights: true,
      lightColor: '#ff0000',
      vibration: true,
    })

  }

  // setBadge(count: number): Promise<any> {

  //     return this.firebase.setBadgeNumber(count);

  // }

  clearAllNotifications(): Promise<void> {

    return PushNotifications.removeAllDeliveredNotifications()

  }

}
