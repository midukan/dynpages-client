import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController } from '@ionic/angular'
import { finalize } from 'rxjs'
import { BasePage } from 'src/app/abstracts/base-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MiscService } from 'src/app/providers/misc.service'


@Component({
  selector: 'app-contato-page',
  templateUrl: './contato.page.html',
  styleUrls: ['./contato.page.scss']
})
export class ContatoPage extends BasePage {

  contato = {
    nome: '',
    email: '',
    celular: '',
    assunto: '',
    texto: '',
  }

  errors: any

  constructor(
    protected readonly modalCtrl: ModalController,
    protected router: Router,
    protected authService: AuthService,
    public appUtil: AppUtil,
    protected route: ActivatedRoute,
    protected element: ElementRef,
    private miscService: MiscService,
    private loadingCtrl: LoadingController,
  ) {

    super(router, route, modalCtrl, authService, appUtil, element)

    if (this.authService.isAuth()) {
      this.contato.nome = this.usuarioLogado.nomeCompleto
      this.contato.email = this.usuarioLogado.email
      this.contato.celular = this.usuarioLogado.celular
    }

  }

  async enviarForm() {

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' })
    loading.present()

    this.miscService.enviaContato({ contato: this.contato })
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: data => {

          this.appUtil.toast(data.message, 4000, 'success')

          if (this.isModal) {
            this.dismiss()
          } else {
            this.router.navigateByUrl(this.env.paths.isAuthUrl)
          }

        }, error: err => this.appUtil.alertError(err)
      })

  }

}
