import {
  container,
  expect,
  QueryDeepPartialEntity,
  Rhum,
  UserDAO,
} from "../../deps_test.ts";
import { database } from "../util/database.ts";
import { del, get, post, put } from "../util/client.ts";
import { mockUser1, mockUser2, mockUser3, mockUsers } from "../model/user.ts";
import { Gender, log, User } from "../../deps.ts";

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

Rhum.testPlan("user.controller.test.ts", () => {
  Rhum.testSuite("insertUser", () => {
    Rhum.testCase("validationCheck: IDが空なら400", async () => {
      await reset();
      const user = mockUser1();
      delete (user as any).id;

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: IDが空文字なら400", async () => {
      const user = mockUser1();
      user.id = "";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    // FIXME returns 500 !!
    // Rhum.testCase("validationCheck: 重複するIDなら400", async () => {
    //   await reset();
    //   const result1 = await post(url("user"), mockUser1());
    //   await result1.json();
    //   expect(result1.status).toEqual(201);

    //   const user2 = mockUser1();
    //   user2.email = "aaa@example.com"; // メールアドレスも重複回避しているため変える
    //   const result2 = await post(url("user"), mockUser1());

    //   await result2.json();
    //   expect(result2.status).toEqual(400);
    // });

    Rhum.testCase("validationCheck: nameが空なら400", async () => {
      await reset();
      const user = mockUser1();
      delete (user as any).name;

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: nameが空文字なら400", async () => {
      await reset();
      const user = mockUser1();
      user.name = "";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: emailが空なら400", async () => {
      await reset();
      const user = mockUser1();
      delete (user as any).email;

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: emailが空文字なら400", async () => {
      await reset();
      const user = mockUser1();
      user.email = "";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: emailが形式でないなら400", async () => {
      await reset();
      const user = mockUser1();
      user.email = "ああああああああああああああああ";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    // FIXME returns 500 !!
    // Rhum.testCase("validationCheck: 重複するemailなら400", async () => {
    //   await reset();
    //   const result1 = await post(url("user"), mockUser1());
    //   await result1.json();
    //   expect(result1.status).toEqual(201);

    //   const user2 = mockUser1();
    //   user2.id = "aaaaa"; // idも重複回避しているため変える
    //   const result2 = await post(url("user"), mockUser1());

    //   await result2.json();
    //   expect(result2.status).toEqual(400);
    // });

    Rhum.testCase("validationCheck: passwordが空なら400", async () => {
      await reset();
      const user = mockUser1();
      delete (user as any).password;

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: passwordにalphabetがないなら400", async () => {
      await reset();
      const user = mockUser1();
      user.password = "1234567890";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: passwordにnumberがないなら400", async () => {
      await reset();
      const user = mockUser1();
      user.password = "abcdefgABCDEFG";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: passwordが8文字より少ないなら400", async () => {
      await reset();
      const user = mockUser1();
      user.password = "1234abc";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    // FIXME パスワードに空白文字が含まれても通る
    // FIXME パスワードに最大長指定がない

    // FIXME returns 500 !!
    // Rhum.testCase(
    //   "validationCheck: birthdayがYYYY/MM/DD形式でないなら400",
    //   async () => {
    //     await reset();
    //     const user = mockUser1();
    //     user.birthday = "aaaa";

    //     const result = await post(url("user"), user);
    //     await result.json();
    //     expect(result.status).toEqual(400);
    //   },
    // );

    Rhum.testCase("validationCheck: genderは不正値ならdefaultに設定する", async () => {
      await reset();
      const user = mockUser1();
      delete user.gender;

      const result = await post(url("user"), user);
      const json = await result.json();
      expect(json.gender).toEqual(Gender.NotApplicable);
    });

    Rhum.testCase("validationCheck: phoneNumberが不正値なら400", async () => {
      await reset();
      const user = mockUser1();
      user.phoneNumber = "aaaaa";

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("最小構成でpost", async () => {
      await reset();
      const { id, name, password, email } = mockUser1();
      const user = { id, name, password, email };

      const result = await post(url("user"), user);
      await result.json();
      expect(result.status).toEqual(201);
    });
  });

  Rhum.testSuite("updateUserById", () => {
    Rhum.testCase("validationCheck: IDが空なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      const { id } = user;
      delete (user as any).id;

      const result = await put(url(`user/${id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: IDが空文字なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      const { id } = user;
      user.id = "";

      const result = await put(url(`user/${id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    // FIXME returns 500 !!
    // Rhum.testCase("validationCheck: 重複するIDなら400", async () => {
    //   await reset();
    //   const user2 = mockUser2();
    //   await store(user2);

    //   const user1 = mockUser1();
    //   const result = await put(url(`user/${user2.id}`), user1);
    //   await result.json();
    //   expect(result.status).toEqual(400);
    // });

    Rhum.testCase("validationCheck: nameが空なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      delete (user as any).name;

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: nameが空文字なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      user.name = "";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: emailが空なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      delete (user as any).email;

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: emailが空文字なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      user.email = "";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: emailが形式でないなら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      user.email = "ああああああああああああああああ";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    // FIXME returns 500 !!
    // Rhum.testCase("validationCheck: 重複するemailなら400", async () => {
    //   await reset();
    //   const user1 = mockUser1();
    //   await store(user1);

    //   const user2 = mockUser2();
    //   user2.email = user1.email;
    //   const result2 = await put(url(`user/${user2.id}`), mockUser1());
    //   await result2.json();
    //   expect(result2.status).toEqual(400);
    // });

    Rhum.testCase("validationCheck: passwordが空なら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      delete (user as any).password;

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: passwordにalphabetがないなら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      user.password = "1234567890";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: passwordにnumberがないなら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      user.password = "abcdefgABCDEFG";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("validationCheck: passwordが8文字より少ないなら400", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      user.password = "1234abc";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    // FIXME パスワードに空白文字が含まれても通る
    // FIXME パスワードに最大長指定がない

    // FIXME returns 500 !!
    // Rhum.testCase(
    //   "validationCheck: birthdayがYYYY/MM/DD形式でないなら400",
    //   async () => {
    //     await reset();
    //     await store(mockUser1());
    //     const user = mockUser1();
    //     user.birthday = "aaaa";

    //     const result = await put(url(`user/${user.id}`), user);
    //     await result.json();
    //     expect(result.status).toEqual(400);
    //   },
    // );

    Rhum.testCase("validationCheck: genderは不正値ならdefaultに設定する", async () => {
      await reset();
      await store(mockUser1());
      const user = mockUser1();
      delete user.gender;

      const result = await put(url(`user/${user.id}`), user);
      const json = await result.json();
      expect(json.gender).toEqual(Gender.NotApplicable);
    });

    Rhum.testCase("validationCheck: phoneNumberが不正値なら400", async () => {
      await reset();
      const user = mockUser1();
      user.phoneNumber = "aaaaa";

      const result = await put(url(`user/${user.id}`), user);
      await result.json();
      expect(result.status).toEqual(400);
    });

    Rhum.testCase("成功確認", async () => {
      await reset();
      const user = mockUser1();
      await store(user);

      user.name = "HOGE";
      user.password = "1234abcde";

      const result = await put(url(`user/${user.id}`), user);
      const json = await result.json();
      expect(json.name).toEqual("HOGE");
      expect(json.password).toEqual("1234abcde");
    });
  });

  Rhum.testSuite("getUserById", () => {
    Rhum.testCase("ないIDでgetしたら404", async () => {
      await reset();
      await store(mockUser1(), mockUser2(), mockUser3());

      const result = await get(url("user/aaaaaa"));
      await result.text();
      expect(result.status).toEqual(404);
    });

    Rhum.testCase("既存ユーザのIDでgetしたら200", async () => {
      await reset();
      const [user1, user2, user3] = mockUsers();
      await store(user1, user2, user3);

      const result = await get(url(`user/${user2.id}`));
      const json = await result.json();
      expect(result.status).toEqual(200);
      expect(json.name).toEqual(user2.name);
    });
  });

  Rhum.testSuite("removeUser", () => {
    Rhum.testCase("ないIDでdeleteしたら204", async () => {
      await reset();
      await store(mockUser1(), mockUser2(), mockUser3());

      const result = await del(url("user/aaaa"));
      await result.text();
      expect(result.status).toEqual(204);
    });

    Rhum.testCase("削除と確認", async () => {
      await reset();
      const [user1, user2, user3] = mockUsers();
      await store(user1, user2, user3);

      const result1 = await del(url(`user/${user2.id}`));
      await result1.text();
      expect(result1.status).toEqual(204);

      const result2 = await del(url(`user/${user2.id}`));
      await result2.text();
      expect(result2.status).toEqual(204);
    });
  });
});

Rhum.run();
