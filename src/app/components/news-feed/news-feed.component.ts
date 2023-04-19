import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { getSuccessSnackbarOptions } from 'src/app/utils/snackbar-utils'

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {
  webSocketEndPoint = 'ws://localhost:4200/ws/professions'

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.connect()
  }

  private connect(): void {
    let ws = new WebSocket(this.webSocketEndPoint)
    ws.onmessage = (msgEvt) => {
      this.snackBar.open(msgEvt.data, undefined, getSuccessSnackbarOptions())
    }
  }
}
