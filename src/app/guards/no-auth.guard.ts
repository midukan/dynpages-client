import { Injectable } from '@angular/core'
import { ActivatedRoute, CanActivate, Router } from '@angular/router'
import { LoadingController, NavController } from '@ionic/angular'
import { finalize } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

import { AuthService } from '../providers/auth.service'
import { StorageService } from '../providers/storage.service'

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  environment = environment

  constructor(public authService: AuthService, public loadingCtrl: LoadingController,
    public router: Router, public route: ActivatedRoute, private navCtrl: NavController,
    private storageService: StorageService) {

  }

  canActivate(): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      if (this.authService.isAuth()) {

        this.block(resolve, reject)
        return

      }

      if (!await this.storageService.get('access_token')) {
        resolve(true)
        return
      }

      // const loading = await this.loadingCtrl.create({ message: 'Aguarde...' })
      const loading = await this.loadingCtrl.create({ spinner: 'dots', cssClass: 'loading-clear loading-big-spinner' })

      loading.present()

      this.authService.auth()
        .pipe(
          finalize(() => {
            loading.dismiss()
          })
        )
        .subscribe({
          next: auth => {

            this.block(resolve, reject)

          },
          error: err => {

            resolve(true)

          }
        })

    })

  }

  block(resolve, reject) {

    this.navCtrl.navigateRoot(!location.pathname.includes('auth') ? environment.paths.isAuthUrl : environment.paths.isAuthUrlAdmin, { replaceUrl: true })
    reject(true)

  }

}
