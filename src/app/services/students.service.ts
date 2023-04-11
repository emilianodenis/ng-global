import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class StudentService {
  constructor(private http: HttpClient) {}

  public getStudents(): Observable<any> {
    return this.http.get('students')
  }
}
