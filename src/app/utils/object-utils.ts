export function isNullOrUndefined(obj: any): boolean {
  return obj === null || obj === undefined
}

export function isNullOrEmpty(str: string): boolean {
  if (!isNullOrUndefined(str)) return true

  return str.trim() === ''
}
