export function notNullNorUndefined(obj: any): boolean {
  return obj !== null && obj !== undefined
}

export function notNullNorEmpty(str: string): boolean {
  if (!notNullNorUndefined(str)) return false

  return str.trim() !== ''
}
