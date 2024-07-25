import { CidadeListPage } from 'src/app/pages/interno/cidade/cidade-list/cidade-list.page'
import { ContratoFormPage } from 'src/app/pages/interno/contrato/contrato-form/contrato-form.page'
import { ContratoListPage } from 'src/app/pages/interno/contrato/contrato-list/contrato-list.page'
import { PerfilFormPage } from 'src/app/pages/interno/perfil/perfil-form/perfil-form.page'
import { PerfilListPage } from 'src/app/pages/interno/perfil/perfil-list/perfil-list.page'
import { UsuarioFormPage } from 'src/app/pages/usuario/usuario-form/usuario-form.page'
import { UsuarioListPage } from 'src/app/pages/usuario/usuario-list/usuario-list.page'

export interface IAppSelectOptions {
  type: AppSelectTypes;
  label: string;
  modalOptions: {
    component: any;
    cssClass: string;
    componentProps: any;
  };
  modalViewOptions?: {
    component: any;
    cssClass: string;
    componentProps: any;
  };
}

export type AppSelectTypes = 'contratoId' | 'usuarioId' | 'clienteId' | 'cidadeId'

export function selectOptions(environment): IAppSelectOptions[] {

  return [
    {
      type: 'contratoId',
      label: 'Ambiente / Empresa',
      modalOptions: {
        component: ContratoListPage,
        cssClass: 'modal-draggable modal-big',
        componentProps: { state: { filters: {} } }
      },
      modalViewOptions: {
        component: ContratoFormPage,
        cssClass: 'modal-draggable modal-big',
        componentProps: { state: {} }
      }
    },
    {
      type: 'usuarioId',
      label: 'Usuário',
      modalOptions: {
        component: UsuarioListPage,
        cssClass: 'modal-draggable modal-big',
        componentProps: { state: {} }
      },
      modalViewOptions: {
        component: UsuarioFormPage,
        cssClass: 'modal-draggable modal-medium',
        componentProps: { state: {} }
      }
    },
    {
      type: 'clienteId',
      label: 'Cliente',
      modalOptions: {
        component: PerfilListPage,
        cssClass: 'modal-draggable modal-big',
        componentProps: { state: { filters: { perfilTipo: [environment.enums.PerfilTipo.CLIENTE] } } }
      },
      modalViewOptions: {
        component: PerfilFormPage,
        cssClass: 'modal-draggable modal-big',
        componentProps: { state: {} }
      }
    },
    {
      type: 'cidadeId',
      label: 'Cidade',
      modalOptions: {
        component: CidadeListPage,
        cssClass: 'modal-draggable',
        componentProps: { state: { filters: {} } }
      }
    },
  ]

}
