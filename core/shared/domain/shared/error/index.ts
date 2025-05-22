export type ErrorPath = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNestedError(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
