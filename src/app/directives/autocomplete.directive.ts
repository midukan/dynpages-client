import { Directive, ElementRef, HostListener, Input, Renderer2, SimpleChanges } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUtil } from '../app-util';
import { CidadeService } from '../providers/cidade.service';
import { MiscService } from '../providers/misc.service';

export type AutocompleteDirectiveOptionCEP = {
  type: 'CEP',
  entity: any,
  inputs: { logradouro: any, numero: any },
  fields?: {
    logradouro?: string,
    bairro?: string,
    cidade?: string,
    cidadeId?: string,
    estado?: string,
    selData?: string,
  }
}

export type AutocompleteDirectiveOptionCNPJ = {
  type: 'CNPJ',
  entity: any,
  inputs?: { fantasia?: any, },
  fields?: {
    nome?: string,
    fantasia?: string,
    email?: string,
    nascimento?: string,
    optanteSN?: string,
    cep?: string,
    numero?: string,
    complemento?: string,
    logradouro?: string,
    bairro?: string,
    cidade?: string,
    cidadeId?: string,
    estado?: string,
    selData?: string,
    contatos?: string,
  }
}

export type AutocompleteDirectiveOptions = AutocompleteDirectiveOptionCEP | AutocompleteDirectiveOptionCNPJ

@Directive({
  selector: '[app-autocomplete]'
})
export class AutocompleteDirective {

  // private options: AutocompleteDirectiveOptions
  @Input('app-autocomplete') options: AutocompleteDirectiveOptions

  @HostListener('keyup', ['$event'])
  inputKeyup(event: any): void {
    this.keyUp(event.target.value);
  }

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    private loadingCtrl: LoadingController,
    private miscService: MiscService,
    private cidadeService: CidadeService,
    private appUtil: AppUtil,
  ) {

  }

  ngAfterContentInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {

    if (!changes.options) return

    // this.options = this.appUtil.deepCopy(this._options)

    this.options.fields = this.options.fields || {}

    if (this.options.fields) {

      if (this.options.type === 'CEP') {

        this.options.fields.logradouro = this.options.fields.logradouro || 'enderecoLogradouro'
        this.options.fields.bairro = this.options.fields.bairro || 'enderecoBairro'
        this.options.fields.cidade = this.options.fields.cidade || 'enderecoCidade'
        this.options.fields.cidadeId = this.options.fields.cidadeId || 'enderecoCidadeId'
        this.options.fields.estado = this.options.fields.estado || '_estadoId'
        this.options.fields.selData = this.options.fields.selData || 'enderecoCidadeSelectData'

      } else if (this.options.type === 'CNPJ') {

        this.options.fields.nome = this.options.fields.nome || 'nome'
        this.options.fields.fantasia = this.options.fields.fantasia || 'fantasia'
        this.options.fields.email = this.options.fields.email || 'email'
        this.options.fields.nascimento = this.options.fields.nascimento || 'dataNascimento'
        this.options.fields.optanteSN = this.options.fields.optanteSN || 'optanteSN'
        this.options.fields.complemento = this.options.fields.complemento || 'enderecoComplemento'
        this.options.fields.cep = this.options.fields.cep || 'enderecoCEP'
        this.options.fields.numero = this.options.fields.numero || 'enderecoNumero'
        this.options.fields.logradouro = this.options.fields.cidade || 'enderecoLogradouro'
        this.options.fields.bairro = this.options.fields.cidade || 'enderecoBairro'
        this.options.fields.cidade = this.options.fields.cidade || 'enderecoCidade'
        this.options.fields.cidadeId = this.options.fields.cidadeId || 'enderecoCidadeId'
        this.options.fields.estado = this.options.fields.estado || '_estadoId'
        this.options.fields.selData = this.options.fields.selData || 'enderecoCidadeSelectData'
        this.options.fields.contatos = this.options.fields.contatos || undefined // nunca vai ser assim, precisa passar

      }

    }

  }

  async keyUp(value: string) {

    if (this.options.type === 'CEP') {

      const options = this.options as AutocompleteDirectiveOptionCEP

      if (value.length === 9) {

        let loading = await this.loadingCtrl.create({ message: 'Buscando CEP...' })
        loading.present()

        this.miscService.getCEP(this.cidadeService, value)
          .pipe(finalize(() => loading?.dismiss()))
          .subscribe({
            next: async data => {

              options.entity[options.fields!.logradouro!] = data.street || options.entity[options.fields!.logradouro!]
              options.entity[options.fields!.bairro!] = data.neighborhood || options.entity[options.fields!.bairro!]
              options.entity[options.fields!.cidade!] = data.cidade || options.entity[options.fields!.cidade!]
              options.entity[options.fields!.cidadeId!] = data.cidade?.id || options.entity[options.fields!.cidadeId!]
              options.entity[options.fields!.estado!] = data.cidade?.estadoId || options.entity[options.fields!.estado!]

              options.entity[options.fields!.selData!] = { text: data.cidade?.nomeCompleto || 'Selecione', id: data.cidade?.id } || options.entity[options.fields!.selData!]

              setTimeout(() => {
                options.inputs.numero?.setFocus()
              })

            },
            error: err => {
              setTimeout(() => {
                options.inputs.logradouro?.setFocus()
              })
            }
          })

      }

    } else if (this.options.type === 'CNPJ') {

      const options = this.options as AutocompleteDirectiveOptionCNPJ

      if (value.length === 18) {

        let loading = await this.loadingCtrl.create({ message: 'Buscando CNPJ...' })
        loading.present()

        this.miscService.getCNPJ(this.cidadeService, value)
          .pipe(finalize(() => loading?.dismiss()))
          .subscribe({
            next: async data => {

              options.entity[options.fields!.nome!] = data.razao_social.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || options.entity[options.fields!.nome!]
              options.entity[options.fields!.fantasia!] = data.nome_fantasia.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || options.entity[options.fields!.fantasia!]
              options.entity[options.fields!.email!] = data.email || options.entity[options.fields!.email!]
              options.entity[options.fields!.cidade!] = data.cidade || options.entity[options.fields!.cidade!]
              options.entity[options.fields!.cidadeId!] = data.cidade?.id || options.entity[options.fields!.cidadeId!]
              options.entity[options.fields!.estado!] = data.cidade?.estadoId || options.entity[options.fields!.estado!]
              options.entity[options.fields!.bairro!] = data.bairro.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || options.entity[options.fields!.bairro!]
              options.entity[options.fields!.logradouro!] = (data.descricao_tipo_de_logradouro + ' ' + data.logradouro).trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || options.entity[options.fields!.logradouro!]
              options.entity[options.fields!.numero!] = data.numero.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || options.entity[options.fields!.numero!]
              options.entity[options.fields!.cep!] = data.cep.substring(0, 5) + '-' + data.cep.substring(5, 8) || options.entity[options.fields!.cep!]
              options.entity[options.fields!.complemento!] = data.complemento.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || options.entity[options.fields!.complemento!]
              options.entity[options.fields!.nascimento!] = this.appUtil.strToDate(data.data_inicio_atividade).toJSON() || options.entity[options.fields!.nascimento!]
              options.entity[options.fields!.optanteSN!] = !!data.opcao_pelo_simples || options.entity[options.fields!.optanteSN!]

              options.entity[options.fields!.selData!] = { text: data.cidade?.nomeCompleto || 'Selecione', id: data.cidade?.id } || options.entity[options.fields!.selData!]

              if (options.fields!.contatos && !options.entity[options.fields!.contatos]?.length && data.qsa?.length) {
                options.entity[options.fields!.contatos] = data.qsa.map(qsa => ({
                  nome: qsa.nome_socio.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
                  cargo: environment.enums.PerfilContatoCargo.SOCIO,
                }))
              }

              if (data.descricao_situacao_cadastral !== 'ATIVA') {
                this.appUtil.alertMessage('Situação cadastral da empresa não está como ATIVA.')
              }

              setTimeout(() => {
                options.inputs?.fantasia?.setFocus()
              })

            },
            error: err => {
              setTimeout(() => {
                options.inputs?.fantasia?.setFocus()
              })
            }
          })

      }

    }

  }

}
