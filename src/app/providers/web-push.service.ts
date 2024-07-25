import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { Platform } from '@ionic/angular'
import { firstValueFrom, Observable, takeWhile } from 'rxjs'
import { environment } from 'src/environments/environment'

import { AppUtil } from '../app-util'

@Injectable({
  providedIn: 'root'
})
export class WebPushService {

  checkPermInt: any

  constructor(
    private platform: Platform,
    public http: HttpClient,
    private swPush: SwPush,
    private appUtil: AppUtil,
  ) {


  }

  async pushStart(): Promise<any> {

    return new Promise(async (resolve, reject) => {

      if (this.platform.is('capacitor')) {
        resolve(null)
        return
      }

      this.checkPermInt = setInterval(async () => {

        this.getPermission()
          .then(sub => {
            clearInterval(this.checkPermInt)
            resolve(sub)
          })
          .catch(err => { })

      }, 3000)

    })

  }

  async isSubscribed(): Promise<boolean> {

    return !!await firstValueFrom(this.swPush.subscription)

  }

  tokenReceived(): Observable<any> {

    return this.swPush.subscription.pipe(takeWhile(sub => !!sub))

  }

  notificationReceived(): Observable<any> {

    return this.swPush.messages

  }

  notificationClick(): Observable<{ action: string, notification: NotificationOptions & { title: string } }> {

    return this.swPush.notificationClicks

  }

  getPermission(): Promise<any> {

    return this.swPush.requestSubscription({ serverPublicKey: environment.keys.VAPID_PUBLIC_KEY })

  }

}
