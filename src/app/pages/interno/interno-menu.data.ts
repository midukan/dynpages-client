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
    id: 'menu-vendas',
    title: 'Vendas',
    icon: 'app-icon-cart',
    children: [{
      title: 'Ordens de Serviço',
      show: false && restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.VENDEDOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/ordem-servico/list',
      queryParams: undefined
    }, {
      title: 'Frente de Caixa',
      show: false && restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.VENDEDOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/caixa/list',
      queryParams: undefined
    }, {
      title: 'Vendas e Orçamentos',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.VENDEDOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/venda/list',
      queryParams: undefined
    }, {
      title: 'Contratos (Recorrência)',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.VENDEDOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/recorrente/list',
      queryParams: undefined
    }, {
      title: 'Lançam. Financeiros',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/lancamento-entrada/list',
      queryParams: undefined
    }, {
      title: 'NF-e',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.CONTADOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/nf-produto/list',
      queryParams: undefined
    }, {
      title: 'NFS-e',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.CONTADOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/nf-servico/list',
      queryParams: undefined
    }, {
      title: 'NFC-e',
      show: false && restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.CONTADOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/nf-consumidor/list',
      queryParams: undefined
    }]
  }, {
    id: 'menu-compras',
    title: 'Compras',
    icon: 'app-icon-credit-card',
    children: [{
      title: 'Compras',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.COMPRADOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/compra/list',
      queryParams: undefined
    }, {
      title: 'Contratos (Recorrências)',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/recorrente-pgto/list',
      queryParams: undefined
    }, {
      title: 'Lançam. Financeiros',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/lancamento-saida/list',
      queryParams: undefined
    }, {
      title: 'NFs de compras',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.CONTADOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/nf-compra/list',
      queryParams: undefined
    }
      // , {
      //   title: 'Importar NF',
      //   show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.JURIDICO),
      //   routerLink: '/painel/' + restritoPage.contratoId + '/importar-nota',
      //   queryParams: undefined
      // }
    ]
  }, {
    id: 'menu-financeiro',
    title: 'Financeiro',
    icon: 'app-icon-dollar',
    children: [{
      title: 'Contas a pagar',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/conta-pagar/list',
    }, {
      title: 'Contas a receber',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/conta-receber/list',
    }, {
      title: 'Extrato',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/extrato',
      queryParams: undefined
    }]
  }, {
    id: 'menu-estoque',
    title: 'Estoque',
    icon: 'app-icon-box-1',
    children: [{
      title: 'Inventário',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.SUPERVISOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/produto-inventario/list',
      queryParams: undefined
    }]
  }, {
    id: 'menu-cadastros',
    title: 'Cadastros',
    icon: 'app-icon-clipboard-1',
    children: [{
      title: 'Clientes',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FUNCIONARIO),
      routerLink: '/painel/' + restritoPage.contratoId + '/cliente/list',
      queryParams: undefined
    }, {
      title: 'Fornecedores',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FUNCIONARIO),
      routerLink: '/painel/' + restritoPage.contratoId + '/fornecedor/list',
      queryParams: undefined
    }, {
      title: 'Transportadoras',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FUNCIONARIO),
      routerLink: '/painel/' + restritoPage.contratoId + '/transportadora/list',
      queryParams: undefined
    }, {
      title: 'Categoria de produtos',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/categoria-produto/list',
      queryParams: undefined
    }, {
      title: 'Produtos',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/produto/list',
      queryParams: undefined
    }, {
      title: 'Serviços',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/servico/list',
      queryParams: undefined
    }, {
      title: 'Tabelas de preços',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/tabela-preco/list',
      queryParams: undefined
    }, {
      title: 'Categorias',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/categoria/list',
      queryParams: undefined
    }, {
      title: 'Centros de custos',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/centro-custo/list',
      queryParams: undefined
    }, {
      title: 'Contas bancárias',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.ADMIN),
      routerLink: '/painel/' + restritoPage.contratoId + '/conta-bancaria/list',
      queryParams: undefined
    }, {
      title: 'Unidades de medida',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/unidade-medida/list',
      queryParams: undefined
    }]
  }, {
    id: 'menu-controle',
    title: 'Controle',
    icon: 'app-icon-loop-1',
    children: [{
      title: 'Licenças',
      // show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.SUPERVISOR),
      // show: restritoPage.authService.hasPermission('master-admin'),
      show: environment.configs.MODULO_LICENCAS[restritoPage.authService.getContrato().id],
      routerLink: '/painel/' + restritoPage.contratoId + '/licenca/list',
      queryParams: undefined
    }]
  }, {
    id: 'menu-relatorios',
    title: 'Relatórios',
    icon: 'app-icon-chart-bar',
    children: [{
      title: 'Fluxo de Caixa',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/relatorio-fluxo-caixa',
      queryParams: undefined
    }, {
      title: 'DRE/DRC',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/relatorio-dre',
      queryParams: undefined
    }, {
      title: 'Análise de Movimentação',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.FINANCEIRO),
      routerLink: '/painel/' + restritoPage.contratoId + '/relatorio-analise-movimentacao',
      queryParams: undefined
    }, {
      title: 'Vendas',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.GESTAO),
      routerLink: '/painel/' + restritoPage.contratoId + '/relatorio-venda',
      queryParams: undefined
    }, {
      title: 'Situação do Estoque',
      show: restritoPage.authService.hasPermission(restritoPage.env.roles.contratoUsuarioCargoGrupo.SUPERVISOR),
      routerLink: '/painel/' + restritoPage.contratoId + '/relatorio-situacao-estoque',
      queryParams: undefined
    }]
  }, {
    id: 'menu-conteudos',
    title: 'Conteúdos',
    icon: 'app-icon-picture',
    children: [{
      title: 'Banners',
      show: environment.configs.CONTRATO_ID_DEFAULT === restritoPage.authService.getContrato().id && restritoPage.authService.hasPermission('master-admin'),
      routerLink: '/painel/' + restritoPage.contratoId + '/banner',
      queryParams: undefined
    }, {
      title: 'Conteúdos',
      show: environment.configs.CONTRATO_ID_DEFAULT === restritoPage.authService.getContrato().id && restritoPage.authService.hasPermission('master-admin'),
      routerLink: '/painel/' + restritoPage.contratoId + '/conteudo',
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
      title: 'Peers',
      show: environment.configs.IS_MDK_CLEAN_APP && restritoPage.authService.hasPermission('master-admin'),
      routerLink: '/painel/' + restritoPage.contratoId + '/peer/list',
      queryParams: undefined
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
