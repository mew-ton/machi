import { Area } from "../../../deps.ts";
import { UserController } from "./user.controller.ts";

@Area({
  baseRoute: "/api/v1",
  controllers: [UserController],
})
export class UserArea {}
