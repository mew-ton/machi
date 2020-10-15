import { Gender, User } from "../../deps.ts";

export function mockUser1(): User {
  return {
    id: "mock-001",
    name: "小松詩乃",
    email: "shino1969@example.com",
    password: "tvXdV5AQEs",
    birthday: "1969/01/31",
    gender: Gender.Female,
    phoneNumber: "0737-04-2862",
    address: {
      prefecture: "和歌山県",
      postalCode: "640-8101",
      address: "和歌山市新雑賀町3-9",
    },
  };
}

export function mockUser2(): User {
  return {
    id: "mock-002",
    name: "松永光一",
    email: "lightone@example.com",
    password: "qdzZaRwxFF",
    birthday: "1970/05/24",
    gender: Gender.Male,
    phoneNumber: "055-872-8780",
    address: {
      prefecture: "山梨県",
      postalCode: "	400-0111",
      address: "甲斐市	竜王新町	3-8-11	",
    },
  };
}

export function mockUser3(): User {
  return {
    id: "mock-003",
    name: "横山亨治",
    email: "yokoyama003@example.com",
    password: "9gqAXExTKy",
    birthday: "1973/01/20",
    gender: Gender.Male,
    phoneNumber: "099-845-0649",
    address: {
      prefecture: "鹿児島県",
      postalCode: "894-2601",
      address: "大島郡瀬戸内町	与路	2-15	与路タワー418",
    },
  };
}

export function mockUsers(): User[] {
  return [mockUser1(), mockUser2(), mockUser3()];
}
