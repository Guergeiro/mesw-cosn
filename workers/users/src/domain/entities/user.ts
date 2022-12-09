import { JsonEntity, PersistentEntity } from "shared-entities";

export type UserFilters = {
  -readonly [K in keyof Pick<User, "role">]: string;
};

export const Roles = {
  ADMIN: "admin",
  STUDENT: "student",
  FACULTY: "faculty",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export type UserProps = {
  id?: string;
  email: string;
  password: string;
  role: Role;
  name?: string;
};

export class User implements JsonEntity, PersistentEntity {
  readonly #id!: string;
  readonly #email!: string;
  readonly #password!: string;
  readonly #role!: Role;
  readonly #name!: string;

  public constructor(props: UserProps) {
    this.#id = props.id || crypto.randomUUID();
    this.#email = props.email;
    this.#password = props.password;
    this.#role = props.role;
    this.#name = props.name || "";
  }

  public get id() {
    return this.#id;
  }

  public get email() {
    return this.#email;
  }

  public get password() {
    return this.#password;
  }

  public get role() {
    return this.#role;
  }

  public get name() {
    return this.#name;
  }

  public persist(fn: (values: Record<string, unknown>) => Promise<void>) {
    return fn({
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
    });
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
    };
  }
}
