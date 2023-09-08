export function isArrayString(array: Array<any>): array is string[] {
  return array.every((item) => typeof item === 'string');
}
