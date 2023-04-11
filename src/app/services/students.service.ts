import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseStudent, Student } from 'src/app/model/student'

@Injectable()
export class StudentService {
  private static URL = 'students'
  constructor(private http: HttpClient) {}

  public getStudents(): Observable<BaseStudent[]> {
    return this.http.get<BaseStudent[]>(StudentService.URL)
  }

  public getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${StudentService.URL}/${id}`)
  }

  public udpateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${StudentService.URL}/${id}`, student)
  }

  public createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(StudentService.URL, student)
  }
}
