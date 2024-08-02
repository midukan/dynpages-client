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

export type IonSelectTypes = 'contratoUsuarioCargo' | 'usuarioLocalCadastro' | 'usuarioAtivo' | 'perfilTipo' | 'perfilAtivo' | 'estadoId'

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
