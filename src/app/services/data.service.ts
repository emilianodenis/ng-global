import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private static URL = 'data'
  constructor(private http: HttpClient) {}

  public loadData(): Observable<any> {
    return this.http.post<any>(DataService.URL, {})
  }
}
