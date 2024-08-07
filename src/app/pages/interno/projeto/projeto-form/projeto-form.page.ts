import { Component, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { MessageService } from 'src/app/providers/message.service'
import { MiscService } from 'src/app/providers/misc.service'
import { ProjetoService } from 'src/app/providers/projeto.service'
import { SocketService } from 'src/app/providers/socket.service'
import { DateRange } from 'src/app/util'
import { ProjetoPageService } from '../projeto-page.service'

@Component({
  selector: 'app-projeto-form-page',
  templateUrl: './projeto-form.page.html',
  styleUrls: ['./projeto-form.page.scss']
})
export class ProjetoFormPage extends FormPage {

  projetoDefault: any = {
    dataBloqueio: this.appUtil.getDateRange(DateRange.HOJE).end,
    bloqueioParcialDias: 3,
    bloqueioTotalDias: 14,
  }
  projeto: any

  constructor(
    protected modalCtrl: ModalController,
    protected router: Router,
    public messageService: MessageService,
    public appUtil: AppUtil,
    public platform: Platform,
    protected route: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService,
    protected loadingCtrl: LoadingController,
    protected projetoService: ProjetoService,
    protected projetoPageService: ProjetoPageService,
    private miscService: MiscService,
    protected element: ElementRef,
    protected socketService: SocketService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, projetoService, projetoPageService)

  }

  async ngOnInit() {

    await this.ngOnInitDefault('Projeto', 'projeto')

    this.projeto.contratoControleSelectData = { text: this.projeto.contratoControle?.nomeCompleto || 'Selecione', id: this.projeto.contratoControleId }
    this.projeto.competenciaSelectData = { text: this.projeto.competencia?.descricao || 'Selecione', id: this.projeto.competenciaId }

  }

  setFiltersSelectData() {

    // this.projeto.cliente = { id: this.filtersSelectDatas.clienteId?.id, nome: this.filtersSelectDatas.clienteId?.text }
    // this.projeto.clienteId = this.filtersSelectDatas.clienteId?.id

  }

  bloqueioDiasChanged(who: 'parcial' | 'total') {

    if (this.projeto.bloqueioParcialDias > this.projeto.bloqueioTotalDias) {
      if (who === 'parcial') {
        this.projeto.bloqueioTotalDias = this.projeto.bloqueioParcialDias
      } else {
        this.projeto.bloqueioParcialDias = this.projeto.bloqueioTotalDias
      }
    }

  }

}
