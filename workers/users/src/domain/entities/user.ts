export type UserProps = {
  id?: string;
  email: string;
  password: string;
};

export class User {
  readonly #id!: string;
  readonly #email!: string;
  readonly #password!: string;

  public constructor(props: UserProps) {
    if (props.id == null) {
      props.id = crypto.randomUUID();
    }
    this.#id = props.id;
    this.#email = props.email;
    this.#password = props.password;
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

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
    };
  }
}
