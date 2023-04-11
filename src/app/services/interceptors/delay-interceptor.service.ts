import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, delay } from 'rxjs'

@Injectable()
export class DelayInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req.clone()).pipe(delay(250 + Math.random() * 1000))
  }
}
