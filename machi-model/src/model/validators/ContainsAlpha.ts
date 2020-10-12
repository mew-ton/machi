import { registerDecorator } from "../../../deps.ts";
import type { ValidationArguments, ValidationOptions } from "../../../deps.ts";

export function ContainsAlpha(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "containsAlpha",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === "string" && /[a-zA-Z]/.test(value);
        },
      },
    });
  } as PropertyDecorator;
}
