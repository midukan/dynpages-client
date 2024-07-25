import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Platform } from '@ionic/angular'
import { Observable, catchError, concatMap, delay, finalize, of, retryWhen, tap, throwError } from 'rxjs'

import { environment } from '../../environments/environment'
import { AppUtil } from '../app-util'
import { AuthService } from '../providers/auth.service'
import { MessageService } from '../providers/message.service'

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(
    public injector: Injector,
    public platform: Platform,
    public appUtil: AppUtil,
    private authService: AuthService,
    private messageService: MessageService,
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    // if (!req.url.includes(environment.paths.endpointURL) && !req.url.includes(environment.paths.socketURL) && req.url.includes('localhost')) {
    //   return next.handle(req)
    // }

    const clone = this.parseRequest(req)

    const cloned = next.handle(clone)
      .pipe(

        retryWhen(errors => errors
          .pipe(

            concatMap((error, count) => {

              if (count < environment.request.totalRetries && error.status === 0 && clone.headers.get('noClientRetry') !== '1') {
                return of(error.status)
              }

              return throwError(() => error)

            }),

            delay(environment.request.retryDelay)

          )
        ),

        tap(res => this.parseResponseSuccess(clone, res)),
        finalize(() => {

          setTimeout(() => {
            this.messageService.get('modal.resize').next(null)
          }, 200)

        }),

        catchError(res => this.parseResponseError(clone, res))

      )

    return cloned

  }

  private parseRequest(req: HttpRequest<any>): HttpRequest<any> {

    let url: string = req.url

    if (url.indexOf('?') === -1) {
      // url = url + '?' // usando params, ñao precisa disso aqui
    }

    if (url.substring(0, 4) !== 'http') {
      url = environment.paths.endpointURL + '/' + url
    }

    const contratoId = environment.configs?.APP_MULT_AMB ? this.authService.getContrato().id : 1

    const headers: any = contratoId ? { 'X-Contrato-Id': '' + contratoId } : {}

    const otpToken = this.authService.getOTPToken()

    if (otpToken) {
      headers['X-OTP-Token'] = otpToken
    }

    const clone = req.clone({ url, setHeaders: headers })

    return clone

  }

  private parseResponseSuccess(clone: HttpRequest<any>, res: HttpResponse<any> | any) {

    // No backend do projeto
    if (clone.url?.includes(environment.paths.endpointURL) || clone.url?.includes(environment.paths.socketURL)) {

    }

    return res

  }

  private parseResponseError(clone: HttpRequest<any>, res: HttpResponse<any> | any): any {

    // Unauth
    if (res.status === 401 && !res.error.tipo) {
      this.authService.logout(true)
      if (location.pathname !== '/auth') {
        setTimeout(() => { location.reload() }, 2000)
      }
    }

    if (res.error) { // err.error -> body da resposta

      if (!res.error.title) {
        res.error.title = 'Ops!'
      }

      return throwError(() => res.error)

    } else {

      return throwError(() => environment.request.erroPadrao) // erro disparado pelo http do angular

    }

  }

}
