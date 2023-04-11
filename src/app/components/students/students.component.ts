import { Component } from '@angular/core'
import { BaseStudent } from 'src/app/model/student'
import { StudentService } from 'src/app/services/students.service'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  summary: BaseStudent[] = []

  constructor(private studentService: StudentService) {}

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => (this.summary = students),
      error: (err) => console.log(err),
    })
  }

  loadStudent(id: number) {
    this.studentService.getStudent(id).subscribe({
      next: (student) => console.log(student),
      error: (err) => console.log(err),
    })
  }
}
