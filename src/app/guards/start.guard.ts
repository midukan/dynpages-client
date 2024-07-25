import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { finalize, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AppUtil } from '../app-util';
import { AuthService } from '../providers/auth.service';
import { DataService } from '../providers/data.service';
import { MiscService } from '../providers/misc.service';
import { UpdateService } from '../providers/update.service';
import { WebPushService } from '../providers/web-push.service';

@Injectable({
  providedIn: 'root'
})
export class StartGuard implements CanActivate {

  environment = environment

  private MANUAL_UPDATE_INTERVAL = 60000

  constructor(
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public dataService: DataService,
    private appUtil: AppUtil,
    private miscService: MiscService,
    private webPushService: WebPushService,
    private updateService: UpdateService,
    // private swUpdate: SwPush,
  ) {



  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      if (environment._loaded) {
        resolve(true)
        return
      }

      // const loading = await this.loadingCtrl.create({ message: 'Aguarde...' })
      const loading = await this.loadingCtrl.create({ spinner: 'dots', cssClass: 'loading-clear loading-big-spinner' })

      loading.present()

      this.miscRequest()
        .pipe(finalize(() => loading.dismiss()))
        .subscribe({

          next: data => {

            if (data.environment.build.ENV !== environment.name) {
              this.appUtil.pageRequestError('Ambiente (build) do backend diverge do ambiente do front.')
              reject(true)
            }

            this.updateService.updateHandle(environment.build.frontendRealCommit, environment.build.frontendCommit)

            // fica atualizando o environment
            // if (!this.swUpdate.isEnabled) {
            setInterval(() => {
              this.miscRequest().subscribe(() => {
                this.updateService.checkManualUpdate(environment.build.frontendRealCommit, environment.build.frontendCommit, true)
              })
            }, environment.production ? this.MANUAL_UPDATE_INTERVAL : 300000) // 1 min ou 5 min (em dev fica menos logs)
            // }

            this.webPushService.notificationReceived().subscribe(notification => {

              // console.log('notification', notification)

            })

            this.webPushService.notificationClick().subscribe(data => {

              // está navegando via SW, não precisa disso
              // if (data.notification.data.url) {
              //   this.router.navigateByUrl(data.notification.data.url)
              // }

            })

            resolve(true)

          },
          error: err => {

            this.appUtil.pageRequestError(err)

            reject(true)

          }

        })

    })

  }

  miscRequest() {

    return this.miscService.start()
      .pipe(tap(data => {
        environment._loaded = true
        this.appUtil.populateObj(environment, data.environment)
      }))

  }

}

