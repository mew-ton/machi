import { Content, InternalServerError, status } from "../../deps.ts";
import type { ActionResult, ValidationError } from "../../deps.ts";

const { BAD_REQUEST, NOT_FOUND, OK, CREATED, NO_CONTENT } = status;

export type Response<T> = ResponseBody<T> | ResponseError<T>;

export interface ResponseBody<T> extends ActionResult {
  headers: Headers;
  body: { body: T };
  status?: number;
  __isActionResult: boolean;
}

export interface ResponseError<T> extends ActionResult {
  headers: Headers;
  body: {
    body?: T;
    errors: (typeof ValidationError)[];
  };
  status?: number;
  __isActionResult: boolean;
}

export function ok<T>(body: T): Response<T> {
  return Content(body, OK) as ResponseBody<T>;
}

export function created<T>(body: T): Response<T> {
  return Content(body, CREATED) as ResponseBody<T>;
}

export function noContent(): Response<unknown> {
  return Content(status.status(NO_CONTENT), NO_CONTENT) as ResponseBody<
    unknown
  >;
}

export function asBadRequest(error: unknown): Response<unknown>;
export function asBadRequest<T>(body: T, error: unknown): Response<T>;
export function asBadRequest<T>(
  ...args: [T, unknown] | [unknown]
): Response<T> | Response<unknown> {
  if (args.length == 2) {
    const [body, errors] = args;
    return Content(
      { body, errors: validReeuqstError(errors) },
      BAD_REQUEST,
    ) as ResponseError<T>;
  } else if (args.length == 1) {
    const [errors] = args;
    return Content(
      { errors: validReeuqstError(errors) },
      BAD_REQUEST,
    ) as ResponseError<T>;
  } else {
    throw new InternalServerError("Illegal Error State");
  }
}

export function notFound(): Response<unknown> {
  return Content(status.status(NOT_FOUND), NOT_FOUND) as ResponseError<unknown>;
}

function validReeuqstError(errors: unknown): (typeof ValidationError)[] {
  if (errors instanceof Error) {
    throw errors;
  } else if (Array.isArray(errors)) {
    return errors;
  } else {
    throw new InternalServerError("Illegal Error Type: " + errors);
  }
}
