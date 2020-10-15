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
  okOrNotFound,
  Response,
} from "../../model/response.ts";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  public async getUserById(
    @Param("id") id: string,
  ): Promise<Response<User | unknown>> {
    return okOrNotFound(await this.userService.get(id));
  }

  @Put("/:id")
  public async updateUserById(
    @Param("id") id: string,
    @Body(User) user: User,
  ): Promise<Response<User | unknown>> {
    const fixed = this.fixForSaveData(user);
    try {
      await validateOrReject(fixed);
      return okOrNotFound(await this.userService.update(id, fixed));
    } catch (e) {
      return asBadRequest({ ...fixed, id }, e);
    }
  }

  @Post()
  public async insertUser(@Body(User) user: User): Promise<Response<User>> {
    const fixed = this.fixForSaveData(user);
    try {
      await validateOrReject(fixed);
      return created(await this.userService.insert(fixed));
    } catch (e) {
      return asBadRequest(user, e);
    }
  }

  @Delete("/:id")
  public async removeUser(@Param("id") id: string): Promise<Response<unknown>> {
    await this.userService.remove(id);
    return noContent();
  }

  private fixForSaveData(user: User): User {
    user.gender = Genders.toValue(user.gender);
    return user;
  }
}
