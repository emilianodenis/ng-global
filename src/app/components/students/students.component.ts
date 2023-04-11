import { Component } from '@angular/core'
import { BaseStudent, Student } from 'src/app/model/student'
import { StudentService } from 'src/app/services/students.service'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  summary: BaseStudent[] = []
  editedStudent?: Student

  constructor(private studentService: StudentService) {}

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => (this.summary = students),
      error: (err) => console.log(err),
    })
  }

  loadStudent(id: number) {
    this.studentService.getStudent(id).subscribe({
      next: (student) => (this.editedStudent = student),
      error: (err) => console.log(err),
    })
  }

  submit(): void {
    this.studentService
      .udpateStudent(this.editedStudent!.id, this.editedStudent!)
      .subscribe({
        next: (student) => {
          this.editedStudent = undefined
          this.loadStudents()
        },
        error: (err) => console.log(err),
      })
  }

  cancelEditing(): void {
    this.editedStudent = undefined
  }
}
