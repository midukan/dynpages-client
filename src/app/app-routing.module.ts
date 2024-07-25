import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

import { AdminGuard } from './guards/admin.guard'
import { AuthGuard } from './guards/auth.guard'
import { CombinedGuard } from './guards/combined.guard'
import { NoAuthGuard } from './guards/no-auth.guard'
import { StartGuard } from './guards/start.guard'
import { WhateverGuard } from './guards/whatever.guard'
import { ContatoPage } from './pages/contato/contato.page'
import { ErrorPageModule } from './pages/error/error.module'
import { ErrorPage } from './pages/error/error.page'

const routes: Routes = [
  {
    path: '',
    canActivate: [StartGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: '/painel',
      //   pathMatch: 'full'
      // },
      {
        path: 'auth',
        canActivate: [NoAuthGuard],
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
      },
      {
        path: 'convite',
        canActivate: [CombinedGuard],
        data: {
          guards: [AuthGuard]
        },
        loadChildren: () => import('./pages/convite/convite.module').then(m => m.ConvitePageModule)
      },
      {
        path: 'dispositivo',
        canActivate: [CombinedGuard],
        data: {
          guards: [AuthGuard]
        },
        loadChildren: () => import('./pages/interno/usuario-device/usuario-device.module').then(m => m.UsuarioDevicePageModule)
      },
      {
        path: 'criar-conta',
        // component: UsuarioFormPage,
        loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule)
      },
      {
        path: 'painel/:contratoId/configurar-plano', // Usado aqui para ficar sem menu e header (também tem opção no interno)
        canActivate: [CombinedGuard],
        data: {
          guards: [AuthGuard, AdminGuard],
          data: { cargos: 'ADMIN' }
        },
        loadChildren: () => import('./pages/interno/plano/plano.module').then(m => m.PlanoModule)
      },
      {
        path: 'contato',
        component: ContatoPage,
        canActivate: [WhateverGuard],
        loadChildren: () => import('./pages/contato/contato.module').then(m => m.ContatoPageModule)
      },
      {
        path: 'recupera-senha',
        canActivate: [CombinedGuard],
        data: {
          guards: [AuthGuard],
          recuperandoSenha: true
        },
        loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule)
      },
      {
        path: '',
        loadChildren: () => import('./pages/site/site.module').then(m => m.SitePageModule)
      },
      {
        path: 'painel',
        canActivate: [CombinedGuard],
        data: {
          guards: [AuthGuard]
        },
        loadChildren: () => import('./pages/interno/interno.module').then(m => m.InternoPageModule)
      },
    ]
  },
  {
    path: 'erro',
    component: ErrorPage,
    // loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorPageModule)
  },
  {
    path: '**',
    component: ErrorPage,
    // loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorPageModule),
    data: {
      tipo: 'NOT_FOUND'
    },
  }
]
@NgModule({
  imports: [
    // AuthPageModule,
    ErrorPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule { }
