import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Action } from 'src/app/model/action'
import { Character, characterFullName } from 'src/app/model/character'
import { DemoMessage } from 'src/app/model/demo-message'
import { Profession } from 'src/app/model/profession'
import { AppStateService } from 'src/app/services/app-state.service'
import { isNullOrUndefined } from 'src/app/utils/object-utils'
import { getSuccessSnackbarOptions } from 'src/app/utils/snackbar-utils'

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {
  professionWebSocketEndPoint = 'ws://localhost:4200/ws/professions'
  professionIntervalRef?: any

  characterWebSocketEndPoint = 'ws://localhost:4200/ws/characters'
  characterIntervalRef?: any

  constructor(private appStateService: AppStateService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.connect()
  }

  private connect(): void {
    this.connectProfessionWs()
    this.connectCharacterWs()
  }

  private connectCharacterWs(): void {
    if (!isNullOrUndefined(this.characterIntervalRef)) {
      clearInterval(this.characterIntervalRef)
      this.characterIntervalRef = null
    }
    let wsCharacter = new WebSocket(this.characterWebSocketEndPoint)
    wsCharacter.onmessage = this.onCharacterMessage
    wsCharacter.onerror = (evt) => wsCharacter.close()
    wsCharacter.onclose = (evt) =>
      (this.characterIntervalRef = setInterval(() => this.connectCharacterWs(), 1000))
  }

  onCharacterMessage = (msgEvt: MessageEvent<string>) => {
    var message = JSON.parse(msgEvt.data) as DemoMessage<Character>
    if (message.action === Action.SESSION_ID) {
      this.appStateService.chracterSessionId = message.sessionId
    } else {
      this.snackBar.open(this.getCharacterMessage(message), undefined, getSuccessSnackbarOptions())
      this.appStateService.notifyChacracterAction(message)
    }
  }

  private connectProfessionWs(): void {
    if (!isNullOrUndefined(this.professionIntervalRef)) {
      clearInterval(this.professionIntervalRef)
      this.professionIntervalRef = null
    }
    let wsProfession = new WebSocket(this.professionWebSocketEndPoint)
    wsProfession.onmessage = this.onProfessionMessage
    wsProfession.onerror = (evt) => wsProfession.close()
    wsProfession.onclose = (evt) =>
      (this.professionIntervalRef = setInterval(() => this.connectProfessionWs(), 1000))
  }

  onProfessionMessage = (msgEvt: MessageEvent<string>) => {
    var message = JSON.parse(msgEvt.data) as DemoMessage<Profession>
    if (message.action === Action.SESSION_ID) {
      this.appStateService.professionSessionId = message.sessionId
    } else {
      this.snackBar.open(this.getProfessionMessage(message), undefined, getSuccessSnackbarOptions())
      this.appStateService.notifyProfessionAction(message)
    }
  }

  private getProfessionMessage(message: DemoMessage<Profession>): string {
    const profession = message.content.description
    if (message.action === Action.CREATE) {
      return `New profession created: '${profession}'`
    } else if (message.action === Action.UPDATE) {
      return `Profession '${profession}' has just been modified`
    } else if (message.action === Action.DELETE) {
      return `Profession '${profession}' was deleted`
    }
    return ''
  }

  private getCharacterMessage(message: DemoMessage<Character>): string {
    const character = characterFullName(message.content)
    if (message.action === Action.CREATE) {
      return `New character created: '${character}'`
    } else if (message.action === Action.UPDATE) {
      return `Character '${character}' has just been modified`
    } else if (message.action === Action.DELETE) {
      return `Character '${character}' was deleted`
    }
    return ''
  }
}
