import {
  Connection,
  Database,
  Injectable,
  isDefined,
  Repository,
  requireDefined,
  User,
  UserDAO,
} from "../../deps.ts";

@Injectable()
export class UserService {
  constructor(private readonly database: Database) {}

  private connection: Connection | undefined;

  private async repository(): Promise<Repository<UserDAO>> {
    await this.close();
    this.connection = await this.database.connect();
    return this.connection.getRepository(User);
  }

  private async close() {
    if (isDefined(this.connection)) {
      await this.connection.close();
      delete this.connection;
    }
  }

  private async getDAOById(
    repository: Repository<UserDAO>,
    id: string,
  ): Promise<UserDAO | undefined> {
    return repository.findOne({ id });
  }

  private async getIndexById(
    repository: Repository<UserDAO>,
    id: string,
  ): Promise<number | undefined> {
    const raw = await this.getDAOById(repository, id);
    return raw ? raw._id : undefined;
  }

  async get(id: string): Promise<User | undefined> {
    try {
      return await this.getDAOById(await this.repository(), id);
    } finally {
      this.close();
    }
  }

  async insert(user: User): Promise<User> {
    try {
      const repository = await this.repository();
      await repository.insert(user as UserDAO);

      return requireDefined(await this.getDAOById(repository, user.id));
    } finally {
      this.close();
    }
  }

  async update(id: string, user: User): Promise<User | undefined> {
    try {
      const repository = await this.repository();

      const rawId = requireDefined(await this.getIndexById(repository, id));
      await repository.update(rawId, { ...user, id, _id: rawId });

      return requireDefined(await this.getDAOById(repository, id));
    } finally {
      this.close();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const repository = await this.repository();
      const rawId = await this.getIndexById(repository, id);
      if (isDefined(rawId)) {
        await repository.delete(rawId);
      }
    } finally {
      this.close();
    }
  }
}
