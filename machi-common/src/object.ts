import * as deps from "../deps.ts";

type AsDefined<T> = T extends null | undefined ? never : T;

export function isDefined<T>(
  target?: T | null | undefined,
): target is AsDefined<T> {
  return !isNullOrUndefined(target);
}

export function isNullOrUndefined<T>(
  target?: T | null | undefined,
): target is null | undefined {
  return target === null || target === undefined;
}

export function requireDefined<T>(target: T | null | undefined): T {
  if (isNullOrUndefined(target)) {
    throw new Error(
      "Null Reference Error: target is required but is null | undefined",
    );
  }
  return target;
}

export function clone<T>(target: T): T {
  return deps.clone(target);
}
