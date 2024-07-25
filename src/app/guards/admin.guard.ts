import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { AuthService } from '../providers/auth.service';
import { DataService } from '../providers/data.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  environment = environment

  constructor(public authService: AuthService, public loadingCtrl: LoadingController,
    public router: Router, public dataService: DataService, private navCtrl: NavController) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

      const cargos = route.data.cargos

      if (!cargos || (cargos === 'master-admin' && this.authService.getAuth().isMasterAdmin)) {
        resolve(true)
        return
      }

      if (this.authService.hasPermission(environment.roles.contratoUsuarioCargoGrupo[cargos])) {
        resolve(true)
        return
      }

      this.navCtrl.navigateRoot(environment.paths.isAuthUrlAdmin, { replaceUrl: true })

      reject(true)

    })

  }

}
