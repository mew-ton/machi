import { FindConditions, FindOperator } from "../../../deps.ts";

type QueryParams<T> = { [K in keyof T]: string };

export function toFindQuery<T>(queryParams: QueryParams<T>): FindConditions<T> {
  return (Object.keys(queryParams) as (keyof T)[])
    .map((key) => [key, new FindOperator("like", `%${queryParams[key]}%`)])
    .reduce(
      (prev, [key, value]) => ({ ...prev, [key as keyof T]: value }),
      {} as FindConditions<T>,
    );
}
