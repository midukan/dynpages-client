import { AppDatetimeGroupTypes } from '../datetime-group/datetime-group.component'
import { AppDatetimeTypes } from '../datetime/datetime.component'

export interface IIonSelectOptions {
  type: IonSelectTypes,
  label: string,
  multiple: boolean,
  showTodos: boolean,
  options: {
    label: string,
    value: number | string | boolean
  }[]
}

export type IonSelectTypes = 'contratoUsuarioCargo' | 'usuarioLocalCadastro' | 'usuarioAtivo' | 'perfilTipo' | 'perfilAtivo' |
  'produtoAtivo' | 'produtoItemAtivo' | 'servicoAtivo' |
  'competenciaConta' | 'contaDREIntervalo' | 'contaFluxoIntervalo' | 'analiseDRE' | 'ano' | 'mes' | 'anoInicial' | 'anoFinal' | 'estadoId' |
  'categoriaCentroCusto' | 'tipoRelatorioVenda' | 'competenciaStatus' | 'isViaRecorrente' | 'contaPgtoStatus' | 'formaPagamento' |
  'dre' | 'dreReceita' | 'dreDespesa' | 'categoriaDRE' | 'categoriaReceitaDRE' | 'categoriaDespesaDRE' | 'notaStatus'

export interface IIonInputOptions {
  type: IonInputTypes,
  label: string,
  inputType: 'text' | 'tel' | 'email' | 'password'
}

export type IonInputTypes = 'testetesteteste' | 'lalalalala'

export function ionSelectOptions(environment): IIonSelectOptions[] {

  return [
    {
      type: 'contratoUsuarioCargo',
      label: 'Cargo',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.roles.ContratoUsuarioCargoStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'usuarioLocalCadastro',
      label: 'Local Cadastro',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.UsuarioLocalCadastroStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'usuarioAtivo',
      label: 'Usuário Ativo',
      multiple: false,
      showTodos: true,
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]
    },
    {
      type: 'perfilTipo',
      label: 'Tipo',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.PerfilTipoStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'perfilAtivo',
      label: 'Perfil Ativo',
      multiple: false,
      showTodos: true,
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]
    },
    {
      type: 'produtoAtivo',
      label: 'Ativo',
      multiple: false,
      showTodos: true,
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]
    },
    {
      type: 'produtoItemAtivo',
      label: 'Ativo',
      multiple: false,
      showTodos: true,
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]
    },
    {
      type: 'servicoAtivo',
      label: 'Ativo',
      multiple: false,
      showTodos: true,
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]
    },
    {
      type: 'competenciaConta',
      label: 'Tipo',
      multiple: false,
      showTodos: false,
      options: [
        { label: 'Competência', value: 'COMPETENCIA' },
        { label: 'Conta', value: 'CONTA' }
      ]
    },
    {
      type: 'competenciaStatus',
      label: 'Situação',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.CompetenciaStatusStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'isViaRecorrente',
      label: 'Via Recorrente',
      multiple: false,
      showTodos: true,
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]
    },
    {
      type: 'formaPagamento',
      label: 'Forma de Pgto',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.ContaFormaPgtoStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'contaPgtoStatus',
      label: 'Situação',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.ContaPagamentoStatusStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'contaDREIntervalo',
      label: 'Intervalo',
      multiple: false,
      showTodos: false,
      options: Object.entries(environment.enums.ContaDREIntervaloStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'contaFluxoIntervalo',
      label: 'Intervalo',
      multiple: false,
      showTodos: false,
      options: Object.entries(environment.enums.ContaFluxoIntervaloStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'analiseDRE',
      label: 'Análise',
      multiple: true,
      showTodos: false,
      options: [
        { label: 'Vertical', value: 'VERTICAL' },
        { label: 'Horizontal', value: 'HORIZONTAL' }
      ]
    },
    {
      type: 'categoriaDRE',
      label: 'DRE',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.CategoriaDREStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'categoriaReceitaDRE',
      label: 'DRE',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.CategoriaDREStr).filter(c => c[0].substring(0, 4).includes('R_') || c[0].substring(0, 4).includes('NAO')).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'categoriaDespesaDRE',
      label: 'DRE',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.CategoriaDREStr).filter(c => c[0].substring(0, 4).includes('D_') || c[0].substring(0, 4).includes('NAO')).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'categoriaCentroCusto',
      label: 'Perspectiva',
      multiple: false,
      showTodos: false,
      options: [
        { label: 'Categoria', value: 'CATEGORIA' },
        { label: 'Centro de Custo', value: 'CENTRO_CUSTO' }
      ]
    },
    {
      type: 'tipoRelatorioVenda',
      label: 'Tipo',
      multiple: false,
      showTodos: false,
      options: [
        { label: 'Cliente', value: 'CLIENTE' },
        { label: 'Vendedor', value: 'VENDEDOR' },
        { label: 'Produto', value: 'PRODUTO' },
        { label: 'Produto agrupado', value: 'PRODUTO_AGRUPADO' },
      ]
    },
    {
      type: 'ano',
      label: 'Ano',
      multiple: false,
      showTodos: false,
      options: Array.from({ length: new Date().getFullYear() - 2012 }, (_, index) => new Date().getFullYear() - 1 + index).map(ano => ({ label: '' + ano, value: ano }))
    },
    {
      type: 'anoInicial',
      label: 'Ano Inicial',
      multiple: false,
      showTodos: false,
      options: Array.from({ length: new Date().getFullYear() - 2012 }, (_, index) => new Date().getFullYear() - 1 + index).map(ano => ({ label: '' + ano, value: ano }))
    },
    {
      type: 'anoFinal',
      label: 'Ano Final',
      multiple: false,
      showTodos: false,
      options: Array.from({ length: new Date().getFullYear() - 2012 }, (_, index) => new Date().getFullYear() - 1 + index).map(ano => ({ label: '' + ano, value: ano }))
    },
    {
      type: 'mes',
      label: 'Mês',
      multiple: false,
      showTodos: false,
      options: Array.from({ length: 12 }, (_, index) => {
        const date = new Date(2024, index, 1)
        const monthName = date.toLocaleString('pt-BR', { month: 'long' })
        const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
        return {
          label: capitalizedMonthName,
          value: index + 1
        }
      })
    },
    {
      type: 'notaStatus',
      label: 'Situação',
      multiple: true,
      showTodos: true,
      options: Object.entries(environment.enums.NFStatusStr).map(pt => ({ label: '' + pt[1], value: pt[0] }))
    },
    {
      type: 'estadoId',
      label: 'Estado',
      multiple: true,
      showTodos: true,
      options: environment.data.estados.map(estado => ({ label: estado.nome, value: estado.id }))
    },
  ]

}

export function ionInputOptions(environment): IIonInputOptions[] {

  return [
    // {
    //   type: 'documentoLote',
    //   label: 'Lote',
    //   inputType: 'text'
    // },
  ]

}

export function appDatetimeOptions(environment): { type: AppDatetimeTypes, label: string, withTime: boolean }[] {

  return [
    {
      type: 'dataInicial',
      label: 'Data Inicial',
      withTime: false
    }, {
      type: 'dataFinal',
      label: 'Data Final',
      withTime: false
    }, {
      type: 'datahoraInicial',
      label: 'Data Inicial',
      withTime: true
    }, {
      type: 'datahoraFinal',
      label: 'Data Final',
      withTime: true
    }
  ]

}

export function appDatetimeGroupOptions(environment): { type: AppDatetimeGroupTypes, withTime: boolean }[] {

  return [
    {
      type: 'dataGroup',
      withTime: false
    },
    {
      type: 'datahoraGroup',
      withTime: true
    },
  ]

}
