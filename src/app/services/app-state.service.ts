import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Character } from 'src/app/model/character'
import { DemoMessage } from 'src/app/model/demo-message'
import { Profession } from 'src/app/model/profession'

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  constructor() {}

  chracterSessionId?: string
  professionSessionId?: string

  private characterActionSubject = new Subject<DemoMessage<Character>>()
  characterAction$ = this.characterActionSubject.asObservable()
  notifyChacracterAction(message: DemoMessage<Character>): void {
    this.characterActionSubject.next(message)
  }

  private professionActionSubject = new Subject<DemoMessage<Profession>>()
  professionAction$ = this.professionActionSubject.asObservable()
  notifyProfessionAction(message: DemoMessage<Profession>): void {
    this.professionActionSubject.next(message)
  }
}
