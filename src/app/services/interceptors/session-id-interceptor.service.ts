import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AppStateService } from 'src/app/services/app-state.service'

@Injectable()
export class SessionInterceptor {
  constructor(private appStateService: AppStateService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let params = req.params

    if (this.appStateService.chracterSessionId) {
      params = req.params.set(
        'characterSessionId',
        this.appStateService.chracterSessionId
      )
    }

    if (this.appStateService.professionSessionId) {
      params = params.set(
        'professionSessionId',
        this.appStateService.professionSessionId
      )
    }
    const newReq = req.clone({ params: params })

    return next.handle(newReq)
  }
}
