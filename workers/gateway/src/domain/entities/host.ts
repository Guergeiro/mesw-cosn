export type HostProps = {
  id?: string;
  pathname: string;
  hostname: string;
  protected: boolean;
};

export class Host {
  readonly #id!: string;
  readonly #pathname!: string;
  readonly #hostname!: string;
  readonly #protected!: boolean;

  public constructor(props: HostProps) {
    this.#id = props.id || crypto.randomUUID();
    this.#pathname = props.pathname;
    this.#hostname = props.hostname;
    this.#protected = props.protected;
  }

  public get id() {
    return this.#id;
  }

  public get pathname() {
    return this.#pathname;
  }

  public get hostname() {
    return this.#hostname;
  }

  public get protected() {
    return this.#protected;
  }
}
