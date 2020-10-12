import {
  Body,
  Controller,
  Delete,
  Genders,
  Get,
  log,
  Param,
  Post,
  Put,
  User,
  UserService,
  validateOrReject,
} from "../../../deps.ts";
import {
  asBadRequest,
  created,
  noContent,
  ok,
  Response,
} from "../../model/response.ts";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  public async getUserById(@Param("id") id: number): Promise<Response<User>> {
    return ok(await this.userService.getUser(id));
  }

  @Put("/:id")
  public async updateUserById(
    @Param("id") id: number,
    @Body(User) user: User,
  ): Promise<Response<User>> {
    log.info(user);
    const fixed = this.fixForSaveData(user);
    try {
      await validateOrReject(fixed);
      return ok(await this.userService.updateUser(0, fixed));
    } catch (e) {
      return asBadRequest({ ...fixed, id }, e);
    }
  }

  @Post()
  public async insertUser(@Body(User) user: User): Promise<Response<User>> {
    const fixed = this.fixForSaveData(user);
    try {
      await validateOrReject(fixed);
      return created(await this.userService.insertUser(fixed));
    } catch (e) {
      return asBadRequest(user, e);
    }
  }

  @Delete("/:id")
  public async removeUser(@Param("id") id: number): Promise<Response<unknown>> {
    await this.userService.removeUser(0);
    return noContent();
  }

  private fixForSaveData(user: User): User {
    user.gender = Genders.toValue(user.gender);
    return user;
  }
}
