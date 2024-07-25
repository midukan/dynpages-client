import { AppUtil } from 'src/app/app-util';
import { DateRange } from 'src/app/util';

export enum AppDatetimeGroupPeriodos {
  'TODO_PERIODO' = 'TODO_PERIODO',
  'HOJE' = 'HOJE',
  'ESSA_SEMANA' = 'ESSA_SEMANA',
  'ESSE_MES' = 'ESSE_MES',
  'MES_ANTERIOR' = 'MES_ANTERIOR',
  'PROXIMO_MES' = 'PROXIMO_MES',
  'ESSE_ANO' = 'ESSE_ANO',
  'ULTIMOS_30_DIAS' = 'ULTIMOS_30_DIAS',
  'ULTIMOS_12_MESES' = 'ULTIMOS_12_MESES',
  'ULTIMOS_7_DIAS' = 'ULTIMOS_7_DIAS',
  'PROXIMOS_12_MESES' = 'PROXIMOS_12_MESES',
  'PROXIMOS_30_DIAS' = 'PROXIMOS_30_DIAS',
  'PROXIMOS_7_DIAS' = 'PROXIMOS_7_DIAS',
  'PERSONALIZADO' = 'PERSONALIZADO'
}

export enum AppDatetimeGroupPeriodosStr {
  'TODO_PERIODO' = 'Todo o período',
  'HOJE' = 'Hoje',
  'ESSA_SEMANA' = 'Essa semana',
  'ESSE_MES' = 'Esse mês',
  'MES_ANTERIOR' = 'Mês anterior',
  'PROXIMO_MES' = 'Próximo mês',
  'ESSE_ANO' = 'Esse ano',
  'ULTIMOS_30_DIAS' = 'Últimos 30 dias',
  'ULTIMOS_12_MESES' = 'Últimos 12 meses',
  'ULTIMOS_7_DIAS' = 'Últimos 7 dias',
  'PROXIMOS_12_MESES' = 'Próximos 12 meses`',
  'PROXIMOS_30_DIAS' = 'Próximos 30 dias',
  'PROXIMOS_7_DIAS' = 'Próximos 7 dias',
  'PERSONALIZADO' = 'Período personalizado'
}

export function appDatetimeGroupParseDate(appUtil: AppUtil, periodo: AppDatetimeGroupPeriodos) {

  const agora = new Date()

  let dataInicial: Date | undefined = new Date()
  dataInicial.setHours(0, 0, 0, 0)

  let dataFinal: Date | undefined = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    23, 59, 59, 999
  )

  if (periodo === AppDatetimeGroupPeriodos.TODO_PERIODO) {
    dataInicial = undefined
    dataFinal = undefined
  } else if (periodo === AppDatetimeGroupPeriodos.HOJE) {
    // não faz nada
  } else if (periodo === AppDatetimeGroupPeriodos.ESSA_SEMANA) {
    const { start, end } = appUtil.getDateRange(DateRange.ESTA_SEMANA)
    // dataInicial.setDate(dataInicial.getDate() - dataInicial.getDay())
    // dataFinal.setDate(dataFinal.getDate() + 6 - dataFinal.getDay())
    dataInicial = start
    dataFinal = end
  } else if (periodo === AppDatetimeGroupPeriodos.ESSE_MES) {
    const { start, end } = appUtil.getDateRange(DateRange.ESTE_MES)
    dataInicial = start
    dataFinal = end
    // dataInicial.setDate(1)
    // dataFinal.setMonth(dataFinal.getMonth() + 1)
    // dataFinal.setDate(0)
  } else if (periodo === AppDatetimeGroupPeriodos.MES_ANTERIOR) {
    const { start, end } = appUtil.getDateRange(DateRange.MES_ANTERIOR)
    dataInicial = start
    dataFinal = end
  } else if (periodo === AppDatetimeGroupPeriodos.PROXIMO_MES) {
    const { start, end } = appUtil.getDateRange(DateRange.PROXIMO_MES)
    dataInicial = start
    dataFinal = end
  } else if (periodo === AppDatetimeGroupPeriodos.ESSE_ANO) {
    const { start, end } = appUtil.getDateRange(DateRange.ESTE_ANO)
    dataInicial = start
    dataFinal = end
    // dataInicial.setDate(1)
    // dataInicial.setMonth(0)
    // dataFinal.setFullYear(dataFinal.getFullYear() + 1)
    // dataFinal.setDate(0)
    // dataFinal.setMonth(0)
  } else if (periodo === AppDatetimeGroupPeriodos.ULTIMOS_30_DIAS) {
    const { start, end } = appUtil.getDateRange(DateRange.ULTIMOS_30_DIAS)
    dataInicial = start
    dataFinal = end
    // dataInicial.setDate(dataInicial.getDate() - 30)
  } else if (periodo === AppDatetimeGroupPeriodos.ULTIMOS_12_MESES) {
    const { start, end } = appUtil.getDateRange(DateRange.ULTIMOS_12_MESES)
    dataInicial = start
    dataFinal = end
    // dataInicial.setFullYear(dataInicial.getFullYear() - 1)
  } else if (periodo === AppDatetimeGroupPeriodos.ULTIMOS_7_DIAS) {
    const { start, end } = appUtil.getDateRange(DateRange.ULTIMOS_7_DIAS)
    dataInicial = start
    dataFinal = end
    // dataInicial.setFullYear(dataInicial.getFullYear() - 1)
  } else if (periodo === AppDatetimeGroupPeriodos.PROXIMOS_30_DIAS) {
    const { start, end } = appUtil.getDateRange(DateRange.PROXIMOS_30_DIAS)
    dataInicial = start
    dataFinal = end
    // dataInicial.setDate(dataInicial.getDate() - 30)
  } else if (periodo === AppDatetimeGroupPeriodos.PROXIMOS_12_MESES) {
    const { start, end } = appUtil.getDateRange(DateRange.PROXIMOS_12_MESES)
    dataInicial = start
    dataFinal = end
    // dataInicial.setFullYear(dataInicial.getFullYear() - 1)
  } else if (periodo === AppDatetimeGroupPeriodos.PROXIMOS_7_DIAS) {
    const { start, end } = appUtil.getDateRange(DateRange.PROXIMOS_7_DIAS)
    dataInicial = start
    dataFinal = end
    // dataInicial.setFullYear(dataInicial.getFullYear() - 1)
  } else if (periodo === AppDatetimeGroupPeriodos.PERSONALIZADO) {
    return null
  }

  return { dataInicial, dataFinal, periodo }

}
