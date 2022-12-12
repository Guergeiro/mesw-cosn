import { CourseStatusEnum } from "@domain/enums/course.enum";
import { JsonEntity, PersistentEntity } from "shared-entities";

export type CourseFilters = {
  -readonly [K in keyof Partial<
    Pick<Course, "degreeId" | "status" | "code" | "scientificArea">
  >]: string;
};

export type CourseProps = {
  id?: string;
  degreeId: string;
  code: string;
  name: string;
  description: string;
  status?: CourseStatusEnum;
  abbr: string;
  ects: number;
  scientificArea: string;
};

export class Course implements JsonEntity, PersistentEntity {
  readonly #id: string;
  readonly #degreeId: string;
  readonly #code: string;
  readonly #name: string;
  readonly #description: string;
  readonly #status: CourseStatusEnum;
  readonly #abbr: string;
  readonly #ects: number;
  readonly #scientificArea: string;

  public constructor(props: CourseProps) {
    this.#id = props.id ?? crypto.randomUUID();
    this.#degreeId = props.degreeId;
    this.#code = props.code;
    this.#name = props.name;
    this.#description = props.description;
    this.#status = props.status ?? CourseStatusEnum.IN_PROGRESS;
    this.#abbr = props.abbr;
    this.#ects = props.ects;
    this.#scientificArea = props.scientificArea;
  }

  public get id() {
    return this.#id;
  }

  public get degreeId() {
    return this.#degreeId;
  }

  public get name() {
    return this.#name;
  }

  public get description() {
    return this.#description;
  }

  public get status() {
    return this.#status;
  }

  public get code() {
    return this.#code;
  }

  public get abbr() {
    return this.#abbr;
  }

  public get ects() {
    return this.#ects;
  }

  public get scientificArea() {
    return this.#scientificArea;
  }

  persist(fn: (values: Record<string, unknown>) => Promise<void>) {
    return fn({
      id: this.#id,
      degreeId: this.#degreeId,
      code: this.#code,
      name: this.#name,
      description: this.#description,
      status: this.#status,
      abbr: this.#abbr,
      ects: this.#ects,
      scientificArea: this.#scientificArea,
    });
  }

  toJSON() {
    return {
      id: this.#id,
      degreeId: this.#degreeId,
      code: this.#code,
      name: this.#name,
      description: this.#description,
      status: this.#status,
      abbr: this.#abbr,
      ects: this.#ects,
      scientificArea: this.#scientificArea,
    };
  }
}
