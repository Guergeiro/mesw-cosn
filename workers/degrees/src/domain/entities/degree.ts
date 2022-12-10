import { DegreeStatusEnum, EqfLevelEnum } from "@domain/enums/degree.enum";

export type DegreeFilters = {
  -readonly [K in keyof Partial<
    Pick<Degree, "facultyId" | "status" | "eqfLevel">
  >]: string;
};

export type DegreeProps = {
  id?: string;
  facultyId: string;
  code: string;
  name: string;
  eqfLevel: EqfLevelEnum;
  status: DegreeStatusEnum;
  description: string;
  goals?: string;
  url?: string;
  abbr?: string;
};

export class Degree {
  readonly #id: string;
  readonly #facultyId: string;
  readonly #code: string;
  readonly #name: string;
  readonly #eqfLevel: EqfLevelEnum;
  #status: DegreeStatusEnum;
  #description: string;
  #goals?: string;
  #url?: string;
  #abbr?: string;

  public constructor(props: DegreeProps) {
    this.#id = props.id ?? crypto.randomUUID();
    this.#facultyId = props.facultyId;
    this.#code = props.code;
    this.#name = props.name;
    this.#eqfLevel = props.eqfLevel;
    this.#status = props?.status ?? DegreeStatusEnum.DRAFT;
    this.#description = props.description;
    this.#goals = props?.goals;
    this.#url = props?.url;
    this.#abbr = props?.abbr;
  }

  public get id() {
    return this.#id;
  }

  public get facultyId() {
    return this.#facultyId;
  }

  public get eqfLevel() {
    return this.#eqfLevel;
  }

  public set description(description: string) {
    this.#description = description;
  }

  public get status() {
    return this.#status;
  }

  public set status(status: DegreeStatusEnum) {
    this.#status = status;
  }

  public set url(url: string) {
    this.#url = url;
  }

  public set abbr(abbr: string) {
    this.#abbr = abbr;
  }

  public set goals(goals: string) {
    this.#goals = goals;
  }

  public persist(fn: (values: Record<string, unknown>) => Promise<void>) {
    return fn({
      facultyId: this.#facultyId,
      code: this.#code,
      name: this.#name,
      eqfLevel: this.#eqfLevel,
      status: this.#status,
      description: this.#description,
      goals: this.#goals,
      url: this.#url,
      abbr: this.#abbr,
    });
  }

  public toJSON() {
    return {
      id: this.#id,
      facultyId: this.#facultyId,
      code: this.#code,
      name: this.#name,
      eqfLevel: this.#eqfLevel,
      status: this.#status,
      description: this.#description,
      goals: this.#goals,
      url: this.#url,
      abbr: this.#abbr,
    };
  }
}