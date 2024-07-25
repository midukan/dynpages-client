import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin.guard';

import { InternoPage } from './interno.page';

const routes: Routes = [
  {
    path: '',
    // redirectTo: '0',
    component: InternoPage,
    // pathMatch: 'full'
  },
  {
    path: 'criar-contrato',
    loadChildren: () => import('./contrato/contrato.module').then(m => m.ContratoModule)
  },
  {
    path: 'valida-email',
    component: InternoPage,
  },
  {
    path: ':contratoId',
    component: InternoPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'prefix'
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeAdminModule)
      },
      {
        path: '',
        canActivate: [AdminGuard],
        children: [
          {
            path: 'plano',
            data: { cargos: 'ADMIN' },
            loadChildren: () => import('./plano/plano.module').then(m => m.PlanoModule)
          },
          {
            path: 'contrato',
            data: { cargos: 'MASTER_ADMIN' },
            loadChildren: () => import('./contrato/contrato.module').then(m => m.ContratoModule)
          },
          {
            path: 'contrato-usuario',
            data: { cargos: 'ADMIN' },
            loadChildren: () => import('./contrato-usuario/contrato-usuario.module').then(m => m.ContratoUsuarioModule)
          },
          {
            path: 'usuario',
            data: { cargos: 'MASTER_ADMIN' },
            loadChildren: () => import('../usuario/usuario.module').then(m => m.UsuarioModule)
          },
          {
            path: 'cliente',
            data: { cargos: 'FUNCIONARIO', tipo: ['CLIENTE'] }, // NÃO ACEITA ENV
            loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule)
          },
          {
            path: 'fornecedor',
            data: { cargos: 'FUNCIONARIO', tipo: ['FORNECEDOR'] }, // NÃO ACEITA ENV
            loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule)
          },
          {
            path: 'transportadora',
            data: { cargos: 'FUNCIONARIO', tipo: ['TRANSPORTADORA'] }, // NÃO ACEITA ENV
            loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule)
          },
          {
            path: 'configuracao',
            data: { cargos: 'ADMIN' },
            loadChildren: () => import('./config/config.module').then(m => m.ConfigModule)
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [
    // UsuarioCartaoModule,
    // ContratoUsuarioModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class InternoRoutingModule { }
