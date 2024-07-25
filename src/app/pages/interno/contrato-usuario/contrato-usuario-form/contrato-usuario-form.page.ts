import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, Platform } from '@ionic/angular'
import { finalize } from 'rxjs'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoUsuarioService } from 'src/app/providers/contrato-usuario.service'
import { MessageService } from 'src/app/providers/message.service'
import { PerfilService } from 'src/app/providers/perfil.service'
import { SocketService } from 'src/app/providers/socket.service'
import { UsuarioService } from 'src/app/providers/usuario.service'
import { environment } from 'src/environments/environment'
import { ContratoUsuarioPageService } from '../contrato-usuario-page.service'

@Component({
  selector: 'app-contrato-usuario-form-page',
  templateUrl: './contrato-usuario-form.page.html',
  styleUrls: ['./contrato-usuario-form.page.scss']
})
export class ContratoUsuarioFormPage extends FormPage {

  contratoUsuarioDefault: any = {
    cargo: environment.roles.ContratoUsuarioCargo.GERENTE
  }
  contratoUsuario: any

  perfil: any // para vincular login

  cargos = Object.entries(environment.roles.ContratoUsuarioCargoStr).map(pt => ({ label: environment.roles.ContratoUsuarioCargoStr[pt[0]], value: pt[0] }))

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    protected route: ActivatedRoute,
    protected authService: AuthService,
    protected appUtil: AppUtil,
    public platform: Platform,
    protected loadingCtrl: LoadingController,
    private messageService: MessageService,
    private contratoUsuarioService: ContratoUsuarioService,
    protected element: ElementRef,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService,
    private contratoUsuarioPageService: ContratoUsuarioPageService,
    protected socketService: SocketService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, contratoUsuarioService, contratoUsuarioPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Perfil de Acesso', 'contratoUsuario')

    this.contratoUsuario.usuarioSelectData = { text: this.contratoUsuario.usuario?.nomeCompleto || 'Selecione', id: this.contratoUsuario.usuarioId }

    if (!this.state.contratoUsuario?.id && this.state.contratoId) { // se for inclusão
      this.contratoUsuario.contratoId = this.state.contratoId
    }

    if (this.state.perfil) {
      this.perfil = this.appUtil.deepCopy(this.state.perfil)
    }

  }

  setFiltersSelectData() {

  }

  async salvar() {

    const loading = await this.loadingCtrl.create({ message: 'Salvando...' })
    loading.present()

    this.contratoUsuarioService.save({ contratoUsuario: this.contratoUsuario, perfilId: this.perfil?.id })
      .pipe(finalize(() => {
        loading.dismiss()
      }))
      .subscribe({
        next: async data => {

          this.appUtil.toast(
            this.contratoUsuario.id ? 'Alterado com sucesso.' : 'Acesso criado com sucesso.',
            this.contratoUsuario.id ? 2000 : 2000, 'success')

          if (this.perfil) {
            this.perfilService.entityUpdated.next(null)
          }

          this.contratoUsuarioService.entityUpdated.next(data.contratoUsuario)
          this.usuarioService.entityUpdated.next(null)

          if (this.contratoUsuario.id) {

            if (this.isModal) {
              this.modalCtrl.dismiss({
                contratoUsuario: data.contratoUsuario
              })
            }

          } else {

            if (this.isModal) {
              this.modalCtrl.dismiss({
                contratoUsuario: data.contratoUsuario
              })
            }

          }

        }, error: err => {

          // como tem possível vínculo de login, erros devem ser via alert
          // this.errors = err.message

          // if (typeof err.message === 'string')
          this.appUtil.alertError(err)

        }
      })

  }

}
