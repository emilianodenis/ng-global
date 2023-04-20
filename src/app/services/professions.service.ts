import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Profession } from 'src/app/model/profession'

@Injectable({
  providedIn: 'root',
})
export class ProfessionsService {
  private static URL = 'professions'
  constructor(private http: HttpClient) {}

  private getIdUrl(id: number): string {
    return `${ProfessionsService.URL}/${id}`
  }

  public getProfessions(): Observable<Profession[]> {
    return this.http.get<Profession[]>(ProfessionsService.URL)
  }

  public getProfession(id: number): Observable<Profession> {
    return this.http.get<Profession>(this.getIdUrl(id))
  }

  public udpateProfession(
    id: number,
    profession: Profession
  ): Observable<Profession> {
    return this.http.put<Profession>(this.getIdUrl(id), profession)
  }

  public createProfession(profession: Profession): Observable<Profession> {
    return this.http.post<Profession>(ProfessionsService.URL, profession)
  }

  public deleteProfession(id: number): Observable<any> {
    return this.http.delete(this.getIdUrl(id))
  }
}
