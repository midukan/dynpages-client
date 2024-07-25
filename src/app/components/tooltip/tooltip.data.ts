export enum TooltipContents {

  CATEGORIA = `Categorias são utilizadas para classificar as contas nos relatórios e DRE. Também é conhecida como Classificação Contábil.`,
  CENTRO_CUSTO = `Centros de Custos são utilizados para separar as despesas entre setores ou projetos da empresa. Também aparece em relatórios e DRE.`,

  CONTA_BANCARIA_SALDO = `Preencha com o valor do saldo da sua conta no dia anterior ao iniciar as operações aqui.`,
  CONTA_BANCARIA_SALDO_INFO = `<p>
              ● O saldo das contas bancárias podem levar até 1h para serem atualizados.
            </p>
            <p>
              ● Contas {{ env.infos.payName }} são atualizadas em tempo real, ou seja, a cada conta paga ou recebida.
            </p>
            <p>
              ● Os saldos podem não representar a realidade na instituição financeira, pois ele é calculado
              através das transações realizadas no {{ env.infos.appName }}. Procure sempre realizar as conciliações de
              cada transação.
            </p>
            <p>● Em breve, será possível integrar diretamente com as instituições (bancos) para a realização
              automatizada ou assistida da conciliação bancária.</p>`,
  CONTA_BANCARIA_DATA = `Preencha com o dia de início das suas atividades aqui na plataforma.`,
  CONTA_BANCARIA_INTEGRADA = 'Contas bancárias integradas com seu banco, recebendo diariamente o extrato para conciliação bancária.',
  CONTA_BANCARIA_CLEAN_PAY = 'Conta digital para recebimentos e pagamentos totalmente automatizados.',
  CONTA_BANCARIA_CLEAN_PAY_GERACAO = 'Quando uma fatura ★CleanPay é gerada, ela também é enviada no email do financeiro do seu cliente. Acessando esta conta, você pode copiar o link dela.',
  CONTA_BANCARIA_CLEAN_PAY_PIX = 'Taxa minima para recebimento no Pix de R$ 1,49.',
  CONTA_BANCARIA_CLEAN_PAY_CC = 'Taxa minima para recebimento no cartão de crédito de R$ 1,49.',

  PREVISAO_VENCIMENTO = `A Previsão de Recebimento ou Vencimento é utilizada para contabilização futura no fluxo de caixa e em outros relatórios. Útil na previsibilidade de contas.`,

  PRODUTO_VARIACAO = `Combina tipos de variações com as opções de cada uma, formando um conjunto automatizado de geração de produtos.`,
  PRODUTO_ITEM = `Através das combinações de todas opções de cada variação, obtemos uma lista de produtos variantes. São estes utilizados na vendas.`,

  PRODUTO_ORIGEM = 'Caracteriza o produto com origens de revenda ou fabricação própria.',
  PRODUTO_CEST = 'Caracteriza o produto para possível enquadramento nas normas de Substituição Tributária.',
  PRODUTO_TIPO = 'Caracteriza definições de alíquotas de impostos para o produto.',
  PRODUTO_CFOP = 'Identifica a natureza da circulação de mercadorias ou a prestação de serviços de transportes.',
  PRODUTO_NCM = 'Determina os tributos envolvidos nas operações de comércio exterior e de saída de produtos industrializados. Também é base para o estabelecimento de direitos de defesa comercial, sendo também utilizada no âmbito do ICMS, na valoração aduaneira, em dados estatísticos de importação e exportação, na identificação de mercadorias para efeitos de regimes aduaneiros especiais.',
  PRODUTO_SKU = 'O SKU ou Stock Keeping Unit é um código interno que deve ser preenchido pela empresa. Utilizado para identificação única.',

  SERVICO_NATUREZA = 'Responsável pelo recolhimento.',
  SERVICO_CNAE = 'Configure este CNAE caso este serviço não utilize o CNAE principal.',
  SERVICO_MUNICIPIO = 'Código do serviço no município prestado.',
  SERVICO_NACIONAL = 'CNAE vinculado ao serviço municipal configurado.',
  SERVICO_RETIDO = 'Informa se existe retenção de ISS na cidade prestada.',
  SERVICO_RECOLHIMENTO = 'Quem deve ser o responsável pelo pagamento do ISS.',
  SERVICO_ALIQUOTA = 'Alíquota de ISS na cidade.',
  SERVICO_DEDUCOES = 'Valor total dos materiais utilizados no serviço a serem deduzidos da base de cálculo do ISS.',
  SERVICO_INSS_ALIQUOTA = 'Alíquota de INSS na cidade.',
  SERVICO_INSS_DEDUCOES = 'Valor total dos materiais utilizados no serviço a serem deduzidos da base de cálculo do INSS.',

  NF_PREFEITURA_LOGIN = 'Algumas prefeituras solicitam login e senha para emissão de NFSe.',

  CONTRATO_USU_FAT = 'Configure o usuário responsável pelo pagamento da assinatura. Este deve possuir um cartão de crédito cadastrado para quando a cobrança recorrente está ativa.',

}
