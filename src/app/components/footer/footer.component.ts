import { Component } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { PoliticaTermosPageService } from 'src/app/pages/site/politica-termos/politica-termos-page.service'
import { AuthService } from 'src/app/providers/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  environment = environment

  usuarioLogado: any

  constructor(
    public authService: AuthService,
    public politicaTermosPageService: PoliticaTermosPageService,
    protected loadingCtrl: LoadingController,
  ) {

    this.usuarioLogado = this.authService.getAuth()

  }

  async ngOnInit() {



  }

}
