import { GetDegrees } from "@application/use-cases/degrees/get-degrees";
import { DegreeStatusEnum, EqfLevelEnum } from "@domain/enums/degree.enum";
import { PathsObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const queryValidator = z
  .object({
    facultyId: z.string().uuid().optional(),
    eqfLevel: z.nativeEnum(EqfLevelEnum).optional(),
    status: z.nativeEnum(DegreeStatusEnum).optional(),
  })
  .optional();

export const getDegrees: PathsObject = {
  get: {
    tags: ["degrees"],
    responses: {
      "200": {
        description: "Gets all degrees.",
        content: {
          "application/json": {},
        },
      },
      "400": {
        description: "Bad Request Exception.",
        content: {
          "application/json": {},
        },
      },
    },
    parameters: [
      {
        name: "facultyId",
        in: "query",
        schema: {
          type: "string",
        },
      },
      {
        name: "eqfLevel",
        in: "query",
        schema: {
          type: "string",
          enum: Object.values(EqfLevelEnum),
        },
      },
      {
        name: "status",
        in: "query",
        schema: {
          type: "string",
          enum: Object.values(DegreeStatusEnum),
        },
      },
    ],
  },
};

export class GetDegreesController implements Controller {
  readonly #useCase: GetDegrees;

  public constructor(useCase: GetDegrees) {
    this.#useCase = useCase;
  }

  public async handle(request: Request) {
    const { searchParams } = new URL(request.url);

    const filter = [...searchParams.entries()].reduce(function (
      acc: Record<string, string>,
      [key, value]
    ) {
      acc[key] = value;
      return acc;
    },
    {});

    const parsed = queryValidator.safeParse(filter);

    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const degrees = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(degrees), { status: 200, headers });
  }
}
