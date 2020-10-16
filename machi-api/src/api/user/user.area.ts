import { Area } from "../../../deps.ts";
import { UserController } from "./user.controller.ts";
import { UsersController } from "./users.controller.ts";

@Area({
  baseRoute: "/api/v1",
  controllers: [UserController, UsersController],
})
export class UserArea {}
