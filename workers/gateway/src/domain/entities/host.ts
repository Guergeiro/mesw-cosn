export type HostProps = {
  _id: string;
  pathname: string;
  hostname: string;
};

export class Host {
  readonly #id!: string;
  readonly #pathname!: string;
  readonly #hostname!: string;

  public constructor(props: HostProps) {
    this.#id = props._id;
    this.#pathname = props.pathname;
    this.#hostname = props.hostname;
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
}
