import { isNullOrUndefined } from 'src/app/utils/object-utils'

export function isNullOrEmpty(str: string): boolean {
  if (isNullOrUndefined(str)) return true

  return str.trim() === ''
}
