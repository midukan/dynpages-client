import { Injectable } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { LoadingController, NavController } from '@ionic/angular'
import { finalize } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

import { AppUtil } from '../app-util'
import { OTPModalPageService } from '../pages/interno/otp/otp-page.service'
import { AuthService } from '../providers/auth.service'
import { DataService } from '../providers/data.service'
import { StorageService } from '../providers/storage.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  environment = environment

  constructor(
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public dataService: DataService,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService,
    private appUtil: AppUtil,
    private otpModalPageService: OTPModalPageService,
  ) {


  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      const code = this.appUtil.getUrlVar('code')

      if (location.pathname.split('/')[1] === 'recupera-senha' && code) {

        await this.storageService.set('access_token', code)
        location.search = ''
        return

      }

      if (this.authService.isAuth()) {

        this.done(resolve, reject)
        return

      }

      if (!await this.storageService.get('access_token')) {
        this.block(resolve, reject, route, state)
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

            this.done(resolve, reject)

          },
          error: err => {

            if (err.tipo === 'OTP_MISSING' || err.tipo === 'OTP_FAIL') {
              this.otpModal(resolve, reject, route, state, err)
              return
            }

            this.appUtil.alertError(err)

            this.block(resolve, reject, route, state)

          }
        })

    })

  }

  private async otpModal(resolve: Function, reject: Function, route: any, state: any, err: any) {

    const modal = await this.otpModalPageService.modal(err)

    modal.onDidDismiss().then(data => {

      if (data?.data?.success) {
        this.done(resolve, reject)
      }

      this.block(resolve, reject, route, state)

    })

  }

  private block(resolve: Function, reject: Function, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const isSite = !!route.data.isSite

    this.dataService.set('pathnameRedir', state.url)
    this.navCtrl.navigateRoot(isSite ? environment.paths.noAuthUrl : environment.paths.noAuthUrlAdmin, { replaceUrl: true })
    reject(false)

  }

  private async done(resolve, reject) {

    // Só apagar o pathname se tiver contrato definido ou outra URL
    if (this.dataService.get('pathnameRedir') && this.dataService.get('pathnameRedir').split('/')[2] !== '0') {

      const url = this.dataService.get('pathnameRedir')

      this.dataService.set('pathnameRedir', null)

      this.router.navigateByUrl(url)
      reject(true)

    } else {

      resolve(true)

    }

  }

}
