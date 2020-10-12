import { Database, Injectable, User } from "../../deps.ts";

@Injectable()
export class UserService {
  constructor(private readonly database: Database) {}

  getUser(id: number): Promise<User> {
    return "getUser" as any;
  }

  insertUser(user: User): Promise<User> {
    return "insertUser" as any;
  }

  updateUser(id: number, user: User): Promise<User> {
    return "updateUser" as any;
  }

  removeUser(id: number): Promise<void> {
    return "removeUser" as any;
  }
}
