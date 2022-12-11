import { PersistentEntity } from "shared-entities";

export type FacultyProps = {
  id?: string;
};

export class Faculty implements PersistentEntity {
  readonly #id: string;

  public constructor(props: FacultyProps) {
    this.#id = props.id ?? crypto.randomUUID();
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
