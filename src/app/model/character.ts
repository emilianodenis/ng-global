import { Profession } from 'src/app/model/profession'

export interface BaseCharacter {
  id: number
  firstName: string
  lastName: string
}

export interface Character extends BaseCharacter {
  email: string
  profession: Profession
}

export function characterFullName(character: BaseCharacter): string {
  if (!character) return ''
  return `${character.lastName}, ${character.firstName}`
}
