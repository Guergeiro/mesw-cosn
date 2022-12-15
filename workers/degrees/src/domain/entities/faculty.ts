import { PersistentEntity } from "shared-entities";

export type FacultyProps = {
  id: number;
};

export class Faculty implements PersistentEntity {
  readonly #id: number;

  public constructor(props: FacultyProps) {
    this.#id = props.id;
  }

  public get id() {
    return this.#id;
  }

  public persist(fn: (values: Record<string, unknown>) => Promise<void>) {
    return fn({
      id: this.id,
    });
  }
}
