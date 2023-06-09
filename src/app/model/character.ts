import { Profession } from 'src/app/model/profession'

export interface BaseCharacter {
  id: number
  firstName: string
  lastName: string
}

export interface Character extends BaseCharacter {
  age: number
  profession: Profession
  amount: number
}

export function characterFullName(character: BaseCharacter): string {
  if (!character) return ''
  return `${character.lastName}, ${character.firstName}`
}
