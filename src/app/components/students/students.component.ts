import { Component } from '@angular/core'
import { StudentService } from 'src/app/services/students.service'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  constructor(private studentService: StudentService) {}

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => console.log(students),
      error: (err) => console.log(err),
    })
  }
}
