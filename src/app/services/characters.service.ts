import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseCharacter, Character } from 'src/app/model/character'

@Injectable()
export class CharacterService {
  private static URL = 'characters'
  constructor(private http: HttpClient) {}

  private getIdUrl(id: number): string {
    return `${CharacterService.URL}/${id}`
  }

  public getCharacters(): Observable<BaseCharacter[]> {
    return this.http.get<BaseCharacter[]>(CharacterService.URL)
  }

  public getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(this.getIdUrl(id))
  }

  public udpateCharacter(
    id: number,
    character: Character
  ): Observable<Character> {
    return this.http.put<Character>(this.getIdUrl(id), character)
  }

  public createCharacter(character: Character): Observable<Character> {
    return this.http.post<Character>(CharacterService.URL, character)
  }

  public deleteCharacter(id: number): Observable<any> {
    return this.http.delete(this.getIdUrl(id))
  }
}
