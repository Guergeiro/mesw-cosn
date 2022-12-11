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
  deleted?: boolean;
};

export class User implements JsonEntity, PersistentEntity {
  readonly #id!: string;
  readonly #email!: string;
  readonly #role!: Role;
  readonly #deleted!: boolean;
  #password!: string;
  #name!: string;

  public constructor(props: UserProps) {
    this.#id = props.id || crypto.randomUUID();
    this.#email = props.email;
    this.#password = props.password;
    this.#role = props.role;
    this.#name = props.name || "";
    this.#deleted = props.deleted || false;
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

  public set password(password: string) {
    this.#password = password;
  }

  public get role() {
    return this.#role;
  }

  public get name() {
    return this.#name;
  }

  public set name(name: string) {
    this.#name = name;
  }

  public get deleted() {
    return this.#deleted;
  }

  public persist(fn: (values: Record<string, unknown>) => Promise<void>) {
    return fn({
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
      deleted: this.deleted,
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
