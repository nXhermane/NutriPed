export type ErrorPath = string;

export function getNestedError(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
