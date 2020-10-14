export const enum Gender {
  NotKnown = "not known",
  Male = "male",
  Female = "female",
  NotApplicable = "not applicable",
}

export namespace Genders {
  export function toCode(value?: Gender): number {
    return GenderMapper.of(value).code;
  }

  export function toValue(value?: number | string): Gender {
    return GenderMapper.of(value).name;
  }

  export function values(): Gender[] {
    return [
      Gender.NotKnown,
      Gender.Male,
      Gender.Female,
      Gender.NotApplicable,
    ];
  }

  export function numValues(): number[] {
    return values().map(toCode);
  }

  class GenderMapper {
    private constructor(
      private readonly _code: number,
      private readonly _name: Gender,
    ) {}

    get code(): number {
      return this._code;
    }
    get name(): Gender {
      return this._name;
    }

    valueOf() {
      return this.name;
    }
    toString(): string {
      return this.name;
    }

    public static readonly NotKnown = new GenderMapper(0, Gender.NotKnown);
    public static readonly Male = new GenderMapper(1, Gender.Male);
    public static readonly Female = new GenderMapper(2, Gender.Female);
    public static readonly NotApplicable = new GenderMapper(
      9,
      Gender.NotApplicable,
    );

    public static values() {
      return [
        this.NotKnown,
        this.Male,
        this.Female,
        this.NotApplicable,
      ];
    }

    public static of(raw?: number | string | null | undefined) {
      return this.values().find((v) =>
        typeof raw === "number" ? v.code === raw : v.name === raw
      ) ?? this.NotApplicable;
    }
  }
}
