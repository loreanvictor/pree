export function earr<T>(t: T[] | T): T[] {
  return Array.isArray(t) ? t : [t]
}
