import {
  clone,
  Column,
  Entity,
  isDefined,
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
  @IsString({ message: "都道府県はstringで指定してください" })
  @IsOptional()
  prefecture?: string;

  @Column({ type: String, nullable: true })
  @IsString({ message: "郵便番号はstringで指定してください" })
  @IsOptional()
  postalCode?: string;

  @Column({ type: String, nullable: true })
  @IsString({ message: "住所はstringで指定してください" })
  @IsOptional()
  address?: string;
}

@Entity(TableName.User)
export class UserDAO extends DAO {
  @Column({ type: String, nullable: false, unique: true })
  @IsString({ message: "IDはstringで指定してください" })
  @IsNotEmpty({ message: "IDを入力してください" })
  id!: string;

  @Column({ type: String, nullable: false })
  @IsString({ message: "nameはstringで指定してください" })
  @IsNotEmpty({ message: "名前を入力してください" })
  name!: string;

  @Column({ type: String, nullable: false, unique: true })
  @IsEmail({}, { message: "Emailの形式が不正です" })
  @IsNotEmpty({ message: "Emailを入力してください" })
  email!: string;

  @Column({ type: String, nullable: true })
  @IsString({ message: "passwordはstringで指定してください" })
  @MinLength(8, { message: "パスワードが短すぎます" })
  @ContainsNumber({ message: "数字を含めてください" })
  @ContainsAlpha({ message: "アルファベットを含めてください" })
  @IsNotEmpty({ message: "パスワードを入力してください" })
  password!: string;

  @Column({ type: "date", nullable: true })
  @IsString({ message: "誕生日はstringで指定してください" })
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
  @IsString({ message: "性別はstringで指定してください" })
  @IsOptional()
  gender?: Gender;

  @Column({ type: String, nullable: true })
  @IsPhoneNumber("jp", { message: "電話番号の形式が不正です" })
  @IsString({ message: "電話番号はstringで指定してください" })
  @IsOptional()
  phoneNumber?: string;

  @Column((type) => Address)
  @IsOptional()
  @ValidateNested()
  address?: Address;

  public static toModel(user: UserDAO | undefined): User | undefined {
    if (isDefined(user)) {
      const cloned: User = clone(user);
      delete cloned._id;
      return cloned;
    }
  }
}

export const User = UserDAO;
export type User = NotIndexed<UserDAO>;
