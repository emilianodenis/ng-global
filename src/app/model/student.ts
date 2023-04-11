export interface BaseStudent {
  id: number
  firstName: string
  lastName: string
}

export interface Student extends BaseStudent {
  email: string
}
