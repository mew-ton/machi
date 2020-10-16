export interface FindResult<T> {
  size: number;
  list: T[];
}

export function toFindResult<T>(found: T[]): FindResult<T> {
  return {
    size: found.length,
    list: found,
  };
}
