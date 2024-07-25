import { Component, Input, SimpleChanges } from '@angular/core'
import { AppUtil } from 'src/app/app-util'
import { AuthService } from 'src/app/providers/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-resumo-pgto',
  templateUrl: './resumo-pgto.component.html',
  styleUrls: ['./resumo-pgto.component.scss'],
})
export class ResumoPgtoComponent {

  env = environment

  usuarioLogado: any

  validStart: boolean | null = null

  totaisContaPgtos = {
    pago: {
      valorReal: 0,
      valor: 0,
      multa: 0,
      juros: 0,
      desconto: 0,
      tarifa: 0,
    },
    aberto: {
      valorReal: 0,
      valor: 0,
      multa: 0,
      juros: 0,
      desconto: 0,
      tarifa: 0,
    },
    perdido: {
      valorReal: 0,
      valor: 0,
      multa: 0,
      juros: 0,
      desconto: 0,
      tarifa: 0,
    },
    todos: {
      valorReal: 0,
      valor: 0,
      multa: 0,
      juros: 0,
      desconto: 0,
      tarifa: 0,
    }
  }

  @Input() contaPagamentos?: any[]
  @Input() conta?: any

  constructor(public authService: AuthService, public appUtil: AppUtil) {

    this.usuarioLogado = this.authService.getAuth()

  }

  ngOnInit() {

    this.validStart = (this.contaPagamentos || this.conta) && !(this.contaPagamentos && this.conta)

    if (this.conta) {
      this.contaPagamentos = this.conta.contaPagamentos
    }

    this.setContaPgtoTotais()

  }

  ngChanges(changes: SimpleChanges) {

    this.setContaPgtoTotais()

  }

  setContaPgtoTotais() {

    const totaisContaPgtos = {
      pago: {
        valorReal: 0,
        valor: 0,
        multa: 0,
        juros: 0,
        desconto: 0,
        tarifa: 0,
      },
      aberto: {
        valorReal: 0,
        valor: 0,
        multa: 0,
        juros: 0,
        desconto: 0,
        tarifa: 0,
      },
      perdido: {
        valorReal: 0,
        valor: 0,
        multa: 0,
        juros: 0,
        desconto: 0,
        tarifa: 0,
      },
      todos: {
        valorReal: 0,
        valor: 0,
        multa: 0,
        juros: 0,
        desconto: 0,
        tarifa: 0,
      }
    }

    this.contaPagamentos!.filter(cp => !cp.delete).forEach(cp => {

      if (cp.status === this.env.enums.ContaPagamentoStatus.PAGO) {
        totaisContaPgtos.pago.valor = +((totaisContaPgtos.pago.valor + +cp.valor).toFixed(2))
        totaisContaPgtos.pago.valorReal = +((totaisContaPgtos.pago.valorReal + +cp.valorReal).toFixed(2))
        totaisContaPgtos.pago.multa = +((totaisContaPgtos.pago.multa + +cp.multa).toFixed(2))
        totaisContaPgtos.pago.juros = +((totaisContaPgtos.pago.juros + +cp.juros).toFixed(2))
        totaisContaPgtos.pago.desconto = +((totaisContaPgtos.pago.desconto + +cp.desconto).toFixed(2))
        totaisContaPgtos.pago.tarifa = +((totaisContaPgtos.pago.tarifa + +cp.tarifa).toFixed(2))
      } else if (cp.status === this.env.enums.ContaPagamentoStatus.ABERTO) {
        totaisContaPgtos.aberto.valor = +((totaisContaPgtos.aberto.valor + +cp.valor).toFixed(2))
        totaisContaPgtos.aberto.valorReal = +((totaisContaPgtos.aberto.valorReal + +cp.valorReal).toFixed(2))
        totaisContaPgtos.aberto.multa = +((totaisContaPgtos.aberto.multa + +cp.multa).toFixed(2))
        totaisContaPgtos.aberto.juros = +((totaisContaPgtos.aberto.juros + +cp.juros).toFixed(2))
        totaisContaPgtos.aberto.desconto = +((totaisContaPgtos.aberto.desconto + +cp.desconto).toFixed(2))
        totaisContaPgtos.aberto.tarifa = +((totaisContaPgtos.aberto.tarifa + +cp.tarifa).toFixed(2))
      } else if (cp.status === this.env.enums.ContaPagamentoStatus.PERDIDO) {
        totaisContaPgtos.perdido.valor = +((totaisContaPgtos.perdido.valor + +cp.valor).toFixed(2))
        totaisContaPgtos.perdido.valorReal = +((totaisContaPgtos.perdido.valorReal + +cp.valorReal).toFixed(2))
        totaisContaPgtos.perdido.multa = +((totaisContaPgtos.perdido.multa + +cp.multa).toFixed(2))
        totaisContaPgtos.perdido.juros = +((totaisContaPgtos.perdido.juros + +cp.juros).toFixed(2))
        totaisContaPgtos.perdido.desconto = +((totaisContaPgtos.perdido.desconto + +cp.desconto).toFixed(2))
        totaisContaPgtos.perdido.tarifa = +((totaisContaPgtos.perdido.tarifa + +cp.tarifa).toFixed(2))
      }

    })

    totaisContaPgtos.pago.valorReal = +[totaisContaPgtos.pago.valor, totaisContaPgtos.pago.multa, totaisContaPgtos.pago.juros].reduce((prev, curr) => prev + curr, 0).toFixed(2)
    totaisContaPgtos.pago.valorReal = +[totaisContaPgtos.pago.desconto, totaisContaPgtos.pago.tarifa].reduce((prev, curr) => prev - curr, totaisContaPgtos.pago.valorReal).toFixed(2)

    totaisContaPgtos.aberto.valorReal = +[totaisContaPgtos.aberto.valor, totaisContaPgtos.aberto.multa, totaisContaPgtos.aberto.juros].reduce((prev, curr) => prev + curr, 0).toFixed(2)
    totaisContaPgtos.aberto.valorReal = +[totaisContaPgtos.aberto.desconto, totaisContaPgtos.aberto.tarifa].reduce((prev, curr) => prev - curr, totaisContaPgtos.aberto.valorReal).toFixed(2)

    totaisContaPgtos.perdido.valorReal = +[totaisContaPgtos.perdido.valor, totaisContaPgtos.perdido.multa, totaisContaPgtos.perdido.juros].reduce((prev, curr) => prev + curr, 0).toFixed(2)
    totaisContaPgtos.perdido.valorReal = +[totaisContaPgtos.perdido.desconto, totaisContaPgtos.perdido.tarifa].reduce((prev, curr) => prev - curr, totaisContaPgtos.perdido.valorReal).toFixed(2)

    totaisContaPgtos.todos.valorReal = +(totaisContaPgtos.pago.valorReal + totaisContaPgtos.aberto.valorReal + totaisContaPgtos.perdido.valorReal).toFixed(2)
    totaisContaPgtos.todos.valor = +(totaisContaPgtos.pago.valor + totaisContaPgtos.aberto.valor + totaisContaPgtos.perdido.valor).toFixed(2)
    totaisContaPgtos.todos.multa = +(totaisContaPgtos.pago.multa + totaisContaPgtos.aberto.multa + totaisContaPgtos.perdido.multa).toFixed(2)
    totaisContaPgtos.todos.juros = +(totaisContaPgtos.pago.juros + totaisContaPgtos.aberto.juros + totaisContaPgtos.perdido.juros).toFixed(2)
    totaisContaPgtos.todos.desconto = +(totaisContaPgtos.pago.desconto + totaisContaPgtos.aberto.desconto + totaisContaPgtos.perdido.desconto).toFixed(2)
    totaisContaPgtos.todos.tarifa = +(totaisContaPgtos.pago.tarifa + totaisContaPgtos.aberto.tarifa + totaisContaPgtos.perdido.tarifa).toFixed(2)

    this.totaisContaPgtos = totaisContaPgtos

    return totaisContaPgtos

  }

}
