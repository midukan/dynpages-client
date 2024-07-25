import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { finalize, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

import { IFileData } from '../abstracts/backend-service.abstract'
import { CidadeService } from './cidade.service'
import { DataService } from './data.service'

export type ICEPResponse = {
  cep: string,
  state: string,
  city: string,
  cidade: any, // do BE
  neighborhood: string,
  street: string,
}

export interface ISocio {
  pais: string | null;
  nome_socio: string;
  codigo_pais: string | null;
  faixa_etaria: string;
  cnpj_cpf_do_socio: string;
  qualificacao_socio: string;
  codigo_faixa_etaria: number;
  data_entrada_sociedade: string;
  identificador_de_socio: number;
  cpf_representante_legal: string;
  nome_representante_legal: string;
  codigo_qualificacao_socio: number;
  qualificacao_representante_legal: string;
  codigo_qualificacao_representante_legal: number;
}

export interface IEmpresa {
  cidade: any, // do BE
  uf: string;
  cep: string;
  qsa: ISocio[];
  cnpj: string;
  pais: string | null;
  email: string | null;
  porte: string;
  bairro: string;
  numero: string;
  ddd_fax: string;
  municipio: string;
  logradouro: string;
  cnae_fiscal: number;
  codigo_pais: string | null;
  complemento: string;
  codigo_porte: number;
  razao_social: string;
  nome_fantasia: string;
  capital_social: number;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  opcao_pelo_mei: boolean;
  descricao_porte: string;
  codigo_municipio: number;
  cnaes_secundarios: { codigo: number; descricao: string }[];
  natureza_juridica: string;
  situacao_especial: string;
  opcao_pelo_simples: boolean;
  situacao_cadastral: number;
  data_opcao_pelo_mei: string;
  data_exclusao_do_mei: string;
  cnae_fiscal_descricao: string;
  codigo_municipio_ibge: number;
  data_inicio_atividade: string;
  data_situacao_especial: string | null;
  data_opcao_pelo_simples: string;
  data_situacao_cadastral: string;
  nome_cidade_no_exterior: string;
  codigo_natureza_juridica: number;
  data_exclusao_do_simples: string | null;
  motivo_situacao_cadastral: number;
  ente_federativo_responsavel: string;
  identificador_matriz_filial: number;
  qualificacao_do_responsavel: number;
  descricao_situacao_cadastral: string;
  descricao_tipo_de_logradouro: string;
  descricao_motivo_situacao_cadastral: string;
  descricao_identificador_matriz_filial: string;
}

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor(
    public http: HttpClient,
    public dataService: DataService,
  ) {


  }

  start(): Observable<any> {

    const url = 'misc/start' // carrega configs e outros

    return this.http.get(url, {
      params: { environment: environment.name },
      // headers: new HttpHeaders({ noClientRetry: '1' })
    })

    // construir função genérica para isso
    // OFFLINE CACHE
    // .pipe(
    //   tap(async data => await this.storageService.set('req.' + url, data)),
    //   catchError(async err => {
    //     const data = await this.storageService.get('req.' + url)
    //     if (data) return data
    //     throw err
    //   })
    // )

  }

  encriptarString(string: string) {

    const url = 'misc/encrypt-string/' + string

    let params: any = {}

    return this.http.get(url, { params, responseType: 'text' })

  }

  descriptarString(string: string) {

    const url = 'misc/decrypt-string/' + string

    let params: any = {}

    return this.http.get(url, { params, responseType: 'text' })

  }

  getTokenAPI(string: string) {

    const url = 'misc/get-token-api/' + string

    let params: any = {}

    return this.http.get(url, { params, responseType: 'text' })

  }

  getSelectDatas(filters: any) {

    const url = 'misc/getSelectDatas'

    let params: any = { filters: JSON.stringify(filters) }

    return this.http.get(url, { params })

  }

  getCEP(cidadeService: CidadeService, cep: string): Observable<ICEPResponse> {

    return new Observable(observer => {

      const url = `https://brasilapi.com.br/api/cep/v1/${cep}`

      return this.http.get<ICEPResponse>(url)
        .subscribe(
          {
            next: dataCEP => {

              cidadeService.getMany({ estadoSigla: [dataCEP.state], busca: dataCEP.city, pager: { limit: 1 } })
                .pipe(finalize(() => observer.complete()))
                .subscribe({
                  next: data => {

                    dataCEP.cidade = data.cidades.pop()
                    observer.next(dataCEP)
                    observer.complete()

                  }, error: err => observer.error(err)
                })

            }, error: err => observer.error('CEP não localizado. Preencha seu endereço manualmente.')

          })

    })

  }

  getCNPJ(cidadeService: CidadeService, cnpj: string): Observable<IEmpresa> {

    return new Observable(observer => {

      setTimeout(() => {

        observer.error('Não foi possível localizar os dados do CNPJ. Complete os campos manualmente.')
        observer.complete()

      }, 10000);

      const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/\D/g, "")}`

      return this.http.get<IEmpresa>(url)
        .subscribe(
          {
            next: dataCNPJ => {

              cidadeService.getMany({ busca: dataCNPJ.municipio, pager: { limit: 1 } })
                .pipe(finalize(() => observer.complete()))
                .subscribe({
                  next: data => {

                    dataCNPJ.cidade = data.cidades.pop()
                    observer.next(dataCNPJ)

                  }, error: err => observer.error(err)
                })

            }, error: err => observer.error('CNPJ não localizado. Preencha seu endereço manualmente.')

          })

    })

  }

  enviaBugReport(data: IFileData) {

    const url = 'misc/bug-report'

    return this.http.post<any>(url, data)

  }

  enviaContato(contato: any) {

    const url = 'misc/contato' // carrega configs e outros

    return this.http.post<any>(url, contato)

  }

}
