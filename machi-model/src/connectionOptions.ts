import { entities } from "./entity/index.ts";
import type { ConnectionOptions } from "../deps.ts";

export const options: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "machi",
  password: "machi",
  database: "machi",
  synchronize: true,
  logging: true,
  entities: entities(),
  migrations: [],
  subscribers: [],
};
