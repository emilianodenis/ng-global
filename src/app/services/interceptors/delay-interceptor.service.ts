import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, switchMap, timer } from 'rxjs'

@Injectable()
export class DelayInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return timer(250 + Math.random() * 1000).pipe(switchMap(() => next.handle(req.clone())))
  }
}
