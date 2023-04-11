import { Component } from '@angular/core'
import { BaseStudent, Student, studentFullName } from 'src/app/model/student'
import { StudentService } from 'src/app/services/students.service'
import {
  notNullNorEmpty,
  notNullNorUndefined,
} from 'src/app/utils/object-utils'

enum EditState {
  create,
  edit,
  read,
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  studentFullName = studentFullName
  summary: BaseStudent[] = []
  editedStudent?: Student
  state = EditState.read

  get title(): string {
    return this.state === EditState.create
      ? 'Add new student'
      : `Modify ${studentFullName(this.editedStudent as BaseStudent)}`
  }

  get creationMode(): boolean {
    return this.state === EditState.create
  }

  get editionMode(): boolean {
    return this.state === EditState.edit
  }

  get isReadMode(): boolean {
    return this.state === EditState.read
  }

  get canCreate(): boolean {
    return this.isReadMode
  }

  get canSubmit(): boolean {
    return (
      notNullNorUndefined(this.editedStudent) &&
      notNullNorEmpty(this.editedStudent!.firstName) &&
      notNullNorEmpty(this.editedStudent!.lastName) &&
      notNullNorEmpty(this.editedStudent!.email)
    )
  }

  constructor(private studentService: StudentService) {}

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => (this.summary = students),
      error: (err) => console.log(err),
    })
  }

  loadStudent(id: number) {
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.state = EditState.edit
        this.editedStudent = student
      },
      error: (err) => console.log(err),
    })
  }

  submit(): void {
    if (!this.canSubmit) return
    let httpAction$ = this.editionMode
      ? this.studentService.udpateStudent(
          this.editedStudent!.id,
          this.editedStudent!
        )
      : this.studentService.createStudent(this.editedStudent!)
    httpAction$.subscribe({
      next: (student) => {
        this.editedStudent = undefined
        this.state = EditState.read
        this.loadStudents()
      },
      error: (err) => console.log(err),
    })
  }

  createNewStudent(): void {
    this.state = EditState.create
    this.editedStudent = {} as Student
  }

  cancelEditing(): void {
    this.editedStudent = undefined
    this.state = EditState.read
  }
}
