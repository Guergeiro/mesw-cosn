import { CreateDegree } from "@application/use-cases/create-degree/create-degree";
import { DegreeStatusEnum, EqfLevelEnum } from "@domain/enums/degree.enum";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  facultyId: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  eqfLevel: z.nativeEnum(EqfLevelEnum),
  status: z.nativeEnum(DegreeStatusEnum),
  description: z.string().max(2000),
  goals: z.string().max(2000).optional(),
  url: z.string().url().optional(),
  abbr: z.string().optional(),
});

export class CreateController implements Controller {
  readonly #useCase: CreateDegree;

  public constructor(useCase: CreateDegree) {
    this.#useCase = useCase;
  }

  public async handle(request: Request) {
    const len = request.headers.get("content-length") || "0";
    if (len === "0") {
      throw new BadRequestException();
    }

    const parsed = bodyValidator.safeParse(await request.json());

    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const degree = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(degree), { status: 201, headers });
  }
}
