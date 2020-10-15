import { UserArea } from "./user/user.area.ts";
import { AppSettings } from "../../deps.ts";

export const settings: AppSettings = {
  areas: [UserArea],
  logging: true,
};
