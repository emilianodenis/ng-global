import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Profession } from 'src/app/model/profession'

@Injectable()
export class ProfessionsService {
  private static URL = 'professions'
  constructor(private http: HttpClient) {}

  //   For future use
  //   private getIdUrl(id: number): string {
  //     return `${ProfessionsService.URL}/${id}`
  //   }

  public getProfessions(): Observable<Profession[]> {
    return this.http.get<Profession[]>(ProfessionsService.URL)
  }
}
