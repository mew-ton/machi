import { Index, PrimaryGeneratedColumn } from "../../../deps.ts";

@Index(["_id"])
export abstract class DAO {
  @PrimaryGeneratedColumn()
  _id!: number;
}

export type NotIndexed<E extends DAO> = Omit<E, "_id"> & {
  _id?: number | null | undefined;
};

export function removeIndex<E extends DAO>(
  entity: E | NotIndexed<E>,
): NotIndexed<E> {
  delete (entity as any)._id;
  return entity as NotIndexed<E>;
}
