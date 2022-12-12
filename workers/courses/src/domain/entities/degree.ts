import { PersistentEntity } from "shared-entities";

export type DegreeProps = {
  id?: string;
};

export class Degree implements PersistentEntity {
  readonly #id: string;

  public constructor(props: DegreeProps) {
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
