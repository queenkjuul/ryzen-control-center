export function populated(obj): boolean {
  return Object.keys(obj).length !== 0
}

type ObjectKey = string | number
export function getKeyByValue<T>(obj: Record<ObjectKey, T>, value: T): ObjectKey | undefined {
  return Object.keys(obj).find((k) => obj[k] === value)
}

export function swapKeysAndValues<
  K extends string | number | symbol,
  V extends string | number | symbol
>(obj: Partial<Record<K, V>>): Record<V, K> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))
}
