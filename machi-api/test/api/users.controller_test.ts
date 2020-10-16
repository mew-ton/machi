import {
  expect,
  Gender,
  QueryDeepPartialEntity,
  Rhum,
  User,
  UserDAO,
} from "../../deps_test.ts";
import { database } from "../util/database.ts";
import { get } from "../util/client.ts";
import { mockUser1, mockUser2, mockUser3, mockUsers } from "../model/user.ts";

function url(path: string) {
  return `http://localhost:8000/api/v1/${path}`;
}

async function reset() {
  const connect = await database.connect();
  const repository = connect.getRepository(User);
  await repository.clear();
  await connect.close();
}

async function store(...users: User[]) {
  const connect = await database.connect();
  const repository = connect.getRepository(User);

  await repository.insert(users as QueryDeepPartialEntity<UserDAO>[]);
  await connect.close();
}

Rhum.testPlan("users.controller.ts", () => {
  Rhum.testSuite("find users", () => {
    Rhum.testCase("未登録で全件取得時200を返す", async () => {
      await reset();

      const response = await get(url("users"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(0);
    });

    Rhum.testCase("登録有で全件取得時200と登録済みユーザを全件返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(3);
      expect(json.list[1].name).toEqual(mockUser2().name);
    });
  });

  Rhum.testSuite("find users by name", () => {
    Rhum.testCase("不一致の時、空の結果と200を返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users?name=1234"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(0);
    });

    Rhum.testCase("部分一致で複数件返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users?name=山"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(2);
      expect(json.list[0].name).toEqual(mockUser1().name);
    });

    Rhum.testCase("入力値が空文字の場合、200と全件不一致として返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users?name"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(0);
    });
  });

  Rhum.testSuite("find users by email", () => {
    Rhum.testCase("不一致の時、空の結果と200を返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users?email=hogehoge"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(0);
    });

    Rhum.testCase("部分一致で複数件返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users?email=example.com"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(3);
      expect(json.list[1].email).toEqual(mockUser2().email);
    });

    Rhum.testCase("入力値が空文字の場合、200と全件不一致として返す", async () => {
      await reset();
      await store(...mockUsers());

      const response = await get(url("users?email"));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(0);
    });
  });

  Rhum.testSuite("complex find query", () => {
    Rhum.testCase("name, emailの複数設定で検索する", async () => {
      await reset();
      await store(...mockUsers());

      const response1 = await get(url("users?name=山&email=example"));
      const json1 = await response1.json();
      expect(response1.status).toEqual(200);
      expect(json1.size).toEqual(2);

      const response2 = await get(url("users?name=山&email=exxxample"));
      const json2 = await response2.json();
      expect(response2.status).toEqual(200);
      expect(json2.size).toEqual(0);

      const response3 = await get(url("users?name=川&email=example"));
      const json3 = await response3.json();
      expect(response3.status).toEqual(200);
      expect(json3.size).toEqual(0);
    });
  });

  Rhum.testSuite("cannot find other parameters", () => {
    async function test(query: string) {
      const response = await get(url(`users?${query}`));
      const json = await response.json();
      expect(response.status).toEqual(200);
      expect(json.size).toEqual(3);
    }

    Rhum.testCase("他のパラメータでは検索できない: id", async () => {
      await reset();
      await store(...mockUsers());

      await test("id=mock");
    });

    Rhum.testCase("他のパラメータでは検索できない: password", async () => {
      await reset();
      await store(...mockUsers());

      await test("password=XdV5");
    });

    Rhum.testCase("他のパラメータでは検索できない: birthday", async () => {
      await reset();
      await store(...mockUsers());

      await test("birthday=1969/01/31");
    });

    Rhum.testCase("他のパラメータでは検索できない: gender", async () => {
      await reset();
      await store(...mockUsers());

      await test("gender=male");
    });

    Rhum.testCase("他のパラメータでは検索できない: phoneNumber", async () => {
      await reset();
      await store(...mockUsers());

      await test("phoneNumber=04");
    });

    // FIXME オブジェクトの子には対応していない
    // await test("address.prefecture=県");
    // await test("address.postalCode=01");
    // await test("address.address=町");
  });
});

Rhum.run();
