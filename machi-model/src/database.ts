import { createConnection, log, Singleton } from "../deps.ts";
import type { Connection } from "../deps.ts";
import { options } from "./connectionOptions.ts";

@Singleton()
export class Database {
  public async connect(): Promise<Connection> {
    try {
      return await createConnection(options);
    } catch (e) {
      log.error("CANNOT CONNECT: ", e);
      throw e;
    }
  }
}
