import { registerDecorator } from "../../deps.ts";
import type { ValidationArguments, ValidationOptions } from "../../deps.ts";

export function ContainsNumber(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "containsNumber",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === "string" && /[0-9]/.test(value);
        },
      },
    });
  } as PropertyDecorator;
}
