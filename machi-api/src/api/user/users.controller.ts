import {
  clone,
  Controller,
  Get,
  log,
  Req,
  Request,
  toFindQuery,
  toQueryParams,
  User,
  UserService,
} from "../../../deps.ts";
import type { FindResult } from "../../../deps.ts";
import { ok, Response } from "../../model/response.ts";

type QueryParams = { [key: string]: string };

@Controller("/users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUsers(
    @Req() req: Request,
  ): Promise<Response<FindResult<User>>> {
    const queryParams = this.ignoreParamKey(toQueryParams(req));
    return ok(await this.userService.find(toFindQuery(queryParams)));
  }

  // FIXME model側のデコレータで設定できるようにしたい
  private searchPassTargets() {
    return ["name", "email"];
  }

  private ignoreParamKey(params: QueryParams): QueryParams {
    const cloned = clone(params);
    Object.keys(cloned).filter((k) => this.searchPassTargets().indexOf(k) < 0)
      .forEach((k) => delete cloned[k]);
    return cloned;
  }
}
