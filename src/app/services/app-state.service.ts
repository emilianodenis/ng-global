import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  constructor() {}

  chracterSessionId?: string
  professionSessionId?: string
}
