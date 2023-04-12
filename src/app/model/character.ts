export interface BaseCharacter {
  id: number
  firstName: string
  lastName: string
}

export interface Character extends BaseCharacter {
  email: string
  profession: string
}

export function characterFullName(character: BaseCharacter): string {
  if (!character) return ''
  return `${character.lastName}, ${character.firstName}`
}
