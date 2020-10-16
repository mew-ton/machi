import { log, Request } from "../deps.ts";

type QueryParams = { [key: string]: string };

export function toQueryParams(request: Request): QueryParams;
export function toQueryParams(url: string): QueryParams;
export function toQueryParams(req: string | Request): QueryParams {
  return typeof req === "string" ? urlToQuery(req) : toQueryParams(req.url);
}

function urlToQuery(url: string) {
  const [_, query = ""] = decodeURI(url).match(/\?(.*)$/) || [];

  return query.split("&").map((q) => q.split("=")).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: value }),
    {},
  );
}
