import { Component, ElementRef, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, ModalController, NavController } from '@ionic/angular'
import { IBasicBodyData } from 'src/app/abstracts/backend-service.abstract'
import { FormPage } from 'src/app/abstracts/form-page.abstract'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { ContratoService } from 'src/app/providers/contrato.service'
import { MessageService } from 'src/app/providers/message.service'
import { PerfilCartaoService } from 'src/app/providers/perfil-cartao.service'
import { SocketService } from 'src/app/providers/socket.service'
import { PerfilCartaoPageService } from '../perfil-cartao-page.service'

export type FormPageContext = 'modal-form' | 'modal-list' | 'embed-form'

@Component({
  selector: 'app-perfil-cartao-form-page',
  templateUrl: './perfil-cartao-form.page.html',
  styleUrls: ['./perfil-cartao-form.page.scss'],
})

export class PerfilCartaoFormPage extends FormPage {

  @Input('context') context: FormPageContext = 'modal-form'

  perfilCartaoDefault: any = {
    principal: false,
    ativo: true,
    validade: '',
    nome: '',
  }
  perfilCartao: any = {}

  perfilCartaoIugu: any = {}

  constructor(
    public navCtrl: NavController,
    public appUtil: AppUtil,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    private perfilCartaoService: PerfilCartaoService,
    public messageService: MessageService,
    protected element: ElementRef,
    protected perfilCartaoPageService: PerfilCartaoPageService,
    protected socketService: SocketService,
    private contratoService: ContratoService,
  ) {

    super(router, route, modalCtrl, loadingCtrl, authService, appUtil, element, socketService, perfilCartaoService, perfilCartaoPageService)

  }

  async ngOnInit(): Promise<void> {

    await this.ngOnInitDefault('Cartão', 'perfilCartao')

    if (!this.perfilCartao.id) {
      this.perfilCartao.perfilId = this.state.perfilId
    }

  }

  async beforeSave() {

    if (this.perfilCartao.id) return

    const loading = await this.loadingCtrl.create({ message: 'Criptografando...' })
    loading.present()

    const newWindow = window as any
    const Iugu = newWindow.Iugu

    // console.log(Iugu)

    // Todo: fazer validação dos campos em tela, com Iugu fica bom
    // const valNumero = Iugu.utils.validateCreditCardNumber(this.perfilCartaoIugu.numero); // Retorna true
    // const brand = Iugu.utils.getBrandByCreditCardNumber(this.perfilCartaoIugu.numero); // Retorna "visa"
    // const valCVV = Iugu.utils.validateCVV(this.perfilCartaoIugu.cvv, brand); // Retorna true (suportadas pelo CVV: visa, mastercard, amex, diner e elo)
    // const valVencimento = Iugu.utils.validateExpirationString(this.perfilCartao.validade); // Retorna true
    // console.log(valNumero, brand, valCVV, valVencimento)

    if (Iugu.utils.isBlockedByAdBlock()) {
      this.appUtil.alertError('Desative seu bloqueador de Ads (propagandas) para continuar.')
      loading.dismiss()
      return false // cancela salvamento
    }

    Iugu.setAccountID(this.env.keys.IUGU_ACCOUNT) // Precisa ser da conta master apenas ou das subcontas também? (Aguardando ticket)

    Iugu.setTestMode(this.env.name !== 'production')

    const vencimentoSplit = this.perfilCartao.validade.split('/')
    const { nome, sobrenome } = this.appUtil.separaNomeSobrenome(this.perfilCartao.nome)

    const cc = Iugu.CreditCard(this.perfilCartaoIugu.numero, vencimentoSplit[0], vencimentoSplit[1], nome, sobrenome, this.perfilCartaoIugu.cvv)

    const cardData = await new Promise<any>((resolve, reject) => {

      Iugu.createPaymentToken(cc, data => {
        if (data.errors) {
          reject(data.errors)
          return
        }
        resolve(data) // token
      })

    })
      .catch(err => {
        console.error("Erro salvando cartão: " + JSON.stringify(err.errors))
      })

    if (!cardData) {
      this.appUtil.alertError("Erro salvando cartão devido a falha na criptografia dos dados.")
      loading.dismiss()
      return false // cancela salvamento
    }

    /*
    {
      "id": "5915b5e2-9639-4572-a639-27e0863e7aed",
      "method": "credit_card",
      "extra_info": {
        "bin": "411111",
        "year": 2030,
        "month": 12,
        "brand": "VISA",
        "holder_name": "NOME SOBRENOME",
        "display_number": "XXXX-XXXX-XXXX-1111"
      },
      "test": true
    }
    */

    this.perfilCartao.numero = cardData.extra_info.display_number // Iugu
    this.perfilCartao.gatewayTokenFromClient = cardData.id // Iugu

    loading.dismiss()

  }

  async afterSave(data?: IBasicBodyData): Promise<void> {

    // Ativa uma série de eventos que faz com que o getContrato() atualize, bem como os cartões
    this.contratoService.entityUpdated.next(null)

  }

  setFiltersSelectData() { }

  testInputs(onlyProp?: string, etapa?: number) {

    this.errors = this.errors?.filter(err => err.property !== onlyProp) || []

    if ((!onlyProp || onlyProp === 'apelido') && !this.perfilCartao.apelido?.length) {
      this.errors.push({ property: 'apelido', text: 'Preencha corretamente o apelido do cartão.' })
    }

    if ((!onlyProp || onlyProp === 'nome') && !this.appUtil.validaNome(this.perfilCartao.nome)) {
      this.errors.push({ property: 'nome', text: 'Preencha corretamente o nome do cartão.' })
    }

    if ((!onlyProp || onlyProp === 'numero') && !this.appUtil.validaCartaoNumero(this.perfilCartaoIugu.numero)) {
      this.errors.push({ property: 'numero', text: 'Preencha corretamente o número do cartão.' })
    }

    if ((!onlyProp || onlyProp === 'validade') && !this.appUtil.validaCartaoValidade(this.perfilCartao.validade)) {
      this.errors.push({ property: 'validade', text: 'Preencha corretamente a validade do cartão.' })
    }

    if ((!onlyProp || onlyProp === 'cvv') && !this.appUtil.validaCVV(this.perfilCartaoIugu.cvv)) {
      this.errors.push({ property: 'cvv', text: 'Preencha corretamente o CVV.' })
    }

  }

  getInputCSS(inputProperty: string) {

    let ok: boolean | null = null

    if (inputProperty === 'apelido' && this.perfilCartao.apelido) {
      ok = !!this.perfilCartao.apelido?.length
    }

    if (inputProperty === 'nome' && this.perfilCartao.nome) {
      ok = this.appUtil.validaNome(this.perfilCartao.nome)
    }

    if (inputProperty === 'numero' && this.perfilCartaoIugu.numero) {
      ok = this.appUtil.validaCartaoNumero(this.perfilCartaoIugu.numero)
    }

    if (inputProperty === 'validade' && this.perfilCartao.validade) {
      ok = this.appUtil.validaCartaoValidade(this.perfilCartao.validade)
    }

    if (inputProperty === 'cvv' && this.perfilCartaoIugu.cvv) {
      ok = this.appUtil.validaCVV(this.perfilCartaoIugu.cvv)
    }

    if (ok === true) {
      return { class: 'app-valid', icon: 'checkmark' }
    } else if (ok === false) {
      return { class: 'app-invalid', icon: 'close' }
    }

    return { class: '', icon: '' }

  }

}
