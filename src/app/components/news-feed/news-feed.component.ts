import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { Subscription, tap } from 'rxjs'
import { WebSocketSubject, webSocket } from 'rxjs/webSocket'

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent {
  private isConnected = false

  //ws?: typeof webSocket //('ws://localhost:8080/ws')
  ws?: WebSocketSubject<any>
  wsSubscription?: Subscription

  get feedStatus(): string {
    return this.isConnected ? 'Close' : 'Connect'
  }

  news = 'test'

  // webSocketEndPoint: string = 'ws://localhost:8080/ws'
  webSocketEndPoints = [
    'ws://localhost:8080/user',
    // 'ws://localhost:8080/topic/greetings',
    // 'wss://ws.postman-echo.com/raw',
    // 'ws://localhost:8080',
    // 'ws://localhost:8080/',
    // 'ws://localhost:8080/ws',
    // 'ws://localhost:8080/ws/',
    // 'ws://localhost:8080/gs-guide-websocket',
    // 'ws://localhost:8080/gs-guide-websocket/',
    // 'ws://localhost:8080/ws/gs-guide-websocket',
    // 'ws://localhost:8080/ws/gs-guide-websocket/',
    /*'wss://localhost:8080',
    'wss://localhost:8080/',
    'wss://localhost:8080/ws',
    'wss://localhost:8080/ws/',
    'wss://localhost:8080/gs-guide-websocket',
    'wss://localhost:8080/gs-guide-websocket/',
    'wss://localhost:8080/ws/gs-guide-websocket',
    'wss://localhost:8080/ws/gs-guide-websocket/',*/
  ]
  topic: string = '/topic/greetings'
  stompClient: any
  webSocket?: WebSocket

  constructor(private httpClient: HttpClient) {}

  toggleConnection(): void {
    if (this.isConnected) {
      this.ws?.complete()
      this.webSocket?.close()
      this.wsSubscription?.unsubscribe()
    } else {
      this.connect()
      // this.wsSubscription = this.ws.asObservable().subscribe({
      //   next: (msg) => console.log('ok: ', msg),
      //   error: (err) => console.log('err: ', err),
      //   complete: () => console.log('completed'),
      // })
    }
    this.isConnected = !this.isConnected
  }

  private connect(): void {
    // this.httpClient.get<any>('http://localhost:8080/employees').subscribe({
    //   next: (res: any) => console.log(res),
    //   error: (err: any) => console.log('error', err),
    //   complete: () => console.log('complete'),
    // })

    console.log('Initialize WebSocket Connection')
    this.webSocketEndPoints.forEach((e) => {
      console.log('trying to connect with ' + e)
      let weso = new WebSocket(e)
      weso.onmessage = (data) => console.log(data)
      let data = {
        user: 'myself',
      }
      setTimeout(() => weso.send(JSON.stringify(data)), 500)
      // try {
      //   this.ws = webSocket(e)
      //   // this.ws.next('first')
      //   this.ws.pipe(tap((d) => console.log('dans le pipe', d))).subscribe({
      //     next: (msg) => console.log('ok: ', msg),
      //     error: (err) => console.log('err: ', err),
      //     complete: () => console.log('completed'),
      //   })
      //   // window.setTimeout(() => {
      //   //   console.log('ws', this.ws)
      //   this.ws?.next('second')
      //   //   this.ws?.next('third')
      //   //   // this.ws?.complete()
      //   // }, 2000)
      //   // this.webSocket = new WebSocket(e)
      //   // if (this.webSocket) {
      //   //   this.webSocket.onmessage = (evt: any) =>
      //   //     console.log('message from ws', evt)
      //   // }
      // } catch (err) {
      //   console.log('connection failed', err)
      // }
    })
  }
}
