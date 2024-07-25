import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../providers/auth.service'
import { LoadingController } from '@ionic/angular'
import { DataService } from '../providers/data.service'
import { finalize } from 'rxjs'
import { StorageService } from '../providers/storage.service'

@Injectable({
  providedIn: 'root'
})
export class WhateverGuard implements CanActivate {

  constructor(public authService: AuthService, public loadingCtrl: LoadingController,
    public router: Router, public dataService: DataService, private storageService: StorageService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      if (this.authService.isAuth() || !await this.storageService.get('access_token')) {
        resolve(true)
        return
      }

      // const loading = await this.loadingCtrl.create({ message: 'Aguarde...' })
      const loading = await this.loadingCtrl.create({spinner: 'dots', cssClass: 'loading-clear loading-big-spinner'})

      loading.present()

      this.authService.auth()
        .pipe(finalize(() => loading.dismiss()))
        .subscribe({
          next: data => {

            resolve(true)

          },
          error: err => {

            resolve(true)

          }
        })

    })

  }

}
