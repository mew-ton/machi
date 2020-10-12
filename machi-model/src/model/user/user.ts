import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from "../../../deps.ts";
import { ContainsAlpha, ContainsNumber } from "../validators/index.ts";
import type { Gender } from "./gender.ts";

export type PostalCode = string;

export class Address {
  @IsString()
  @IsOptional()
  prefecture?: string;

  @IsString()
  @IsOptional()
  postalCode?: PostalCode;

  @IsString()
  @IsOptional()
  address?: string;
}

console.log(typeof IsPhoneNumber);

export class User {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty({ message: "名前を入力してください" })
  name!: string;

  @IsEmail({ message: "Emailの形式が不正です" })
  @IsNotEmpty({ message: "Emailを入力してください" })
  email!: string;

  @IsString()
  @MinLength(8, { message: "パスワードが短すぎます" })
  @ContainsNumber({ message: "数字を含めてください" })
  @ContainsAlpha({ message: "アルファベットを含めてください" })
  @IsNotEmpty({ message: "パスワードを入力してください" })
  password?: string;

  @IsString()
  @IsOptional()
  birtyday?: string;

  @IsString()
  @IsOptional()
  gender?: Gender;

  @IsPhoneNumber("jp", { message: "電話番号の形式が不正です" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ValidateNested()
  @IsOptional()
  address?: Address;
}
