import { environment } from 'src/environments/environment';
import { InternoPage } from './interno.page';

export interface MenuItem {
  id: string;
  title: string;
  show?: boolean;
  icon: string;
  children?: Partial<MenuItem>[];
  routerLink?: string;
  queryParams?: any;
  click?: () => void;
  href?: string;
  target?: string;
}

export const internoMenuData: (restritoPage: InternoPage) => MenuItem[] = restritoPage => [{

  id: 'grupo-geral',
  title: '',
  icon: '',
  children: [{
    id: 'menu-cadastros',
    title: 'Cadastros',
    icon: 'app-icon-clipboard-1',
    children: [{
      title: 'Clientes',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FUNCIONARIO),
      routerLink: '/painel/' + restritoPage.contratoId + '/cliente/list',
      queryParams: undefined
    }]
  }, {
    id: 'menu-administracao',
    title: 'Administração',
    icon: 'app-icon-cog',
    children: [{
      title: 'Ambientes / Empresas',
      show: restritoPage.authService.hasPermission('master-admin') && restritoPage.env.configs.APP_MULT_AMB,
      routerLink: '/painel/' + restritoPage.contratoId + '/contrato/list',
      queryParams: undefined
    }, {
      title: 'Usuários',
      show: (restritoPage.env.configs.APP_MULT_AMB && restritoPage.authService.hasPermission('master-admin') || (!restritoPage.env.configs.APP_MULT_AMB && restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.ADMIN))),
      routerLink: '/painel/' + restritoPage.contratoId + '/usuario/list',
      queryParams: undefined
    }, {
      title: 'Cargos e acessos',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.ADMIN),
      routerLink: '/painel/' + restritoPage.contratoId + '/contrato-usuario/list',
      queryParams: { filters: '{"contratoId":[' + restritoPage.authService.getContrato().id + ']}' }
    }, {
      title: 'Plano de assinatura',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.ADMIN),
      routerLink: '/painel/' + restritoPage.contratoId + '/plano',
      queryParams: undefined
    }, {
      title: 'Configurações',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.ADMIN),
      routerLink: '/painel/' + restritoPage.contratoId + '/configuracao/list',
      queryParams: undefined
    }]
  }]
}, {
  id: 'grupo-suporte',
  title: 'Suporte',
  icon: '',
  show: true,
  children: [{
    id: 'menu-whatsapp',
    title: 'WhatsApp',
    show: true,
    icon: 'app-icon-whatsapp',
    href: environment.paths.SUPPORT_LINK,
    target: '_blank',
  }, {
    id: 'menu-mail',
    title: 'Email',
    show: true,
    icon: 'app-icon-mail',
    click: () => restritoPage.contatoPageService.modalForm(),
  }]
}]
