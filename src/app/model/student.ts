export interface BaseStudent {
  id: number
  firstName: string
  lastName: string
}

export interface Student extends BaseStudent {
  email: string
}

export function studentFullName(student: BaseStudent): string {
  if (!student) return ''
  return `${student.lastName}, ${student.firstName}`
}
