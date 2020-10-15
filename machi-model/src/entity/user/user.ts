import {
  Column,
  Entity,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from "../../../deps.ts";
import { ContainsAlpha, ContainsNumber } from "../../validators/index.ts";
import { Gender, Genders } from "./gender.ts";
import { DAO, NotIndexed } from "../common/entity.ts";
import { TableName } from "../common/tableName.ts";

export class Address {
  @Column({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  prefecture?: string;

  @Column({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @Column({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  address?: string;
}

@Entity(TableName.User)
export class UserDAO extends DAO {
  @Column({ type: String, nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Column({ type: String, nullable: false })
  @IsString()
  @IsNotEmpty({ message: "名前を入力してください" })
  name!: string;

  @Column({ type: String, nullable: false, unique: true })
  @IsEmail({}, { message: "Emailの形式が不正です" })
  @IsNotEmpty({ message: "Emailを入力してください" })
  email!: string;

  @Column({ type: String, nullable: true })
  @IsString()
  @MinLength(8, { message: "パスワードが短すぎます" })
  @ContainsNumber({ message: "数字を含めてください" })
  @ContainsAlpha({ message: "アルファベットを含めてください" })
  @IsNotEmpty({ message: "パスワードを入力してください" })
  password!: string;

  @Column({ type: "date", nullable: true })
  @IsString()
  @IsOptional()
  birthday?: string;

  @Column(
    {
      type: Number,
      transformer: {
        from: Genders.toValue,
        to: Genders.toCode,
      },
    },
  )
  @IsString()
  @IsOptional()
  gender?: Gender;

  @Column({ type: String, nullable: true })
  @IsPhoneNumber("jp", { message: "電話番号の形式が不正です" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Column((type) => Address)
  @IsOptional()
  @ValidateNested()
  address?: Address;
}

export const User = UserDAO;
export type User = NotIndexed<UserDAO>;
