import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AutoInvestService {
  private static URL = 'auto-invest'
  constructor(private http: HttpClient) {}

  private getIdUrl(id: number): string {
    return `${AutoInvestService.URL}/${id}`
  }

  triggerAutoInvest(characterId: number): Observable<string> {
    return this.http.post<string>(this.getIdUrl(characterId), {})
  }
}
