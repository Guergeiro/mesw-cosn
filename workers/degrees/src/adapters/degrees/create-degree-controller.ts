import { generateSchema } from "@anatine/zod-openapi";
import { CreateDegree } from "@application/use-cases/degrees/create-degree";
import { EqfLevelEnum } from "@domain/enums/degree.enum";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  facultyId: z.number(),
  code: z.string(),
  name: z.string(),
  eqfLevel: z.nativeEnum(EqfLevelEnum),
  description: z.string().max(2000),
  tuition: z.number(),
  goals: z.string().max(2000).optional(),
  url: z.string().url().optional(),
  abbr: z.string().optional(),
});

export const createDegree: PathItemObject = {
  post: {
    tags: ["degrees"],
    responses: {
      "201": {
        description: "Get created degree.",
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
    requestBody: {
      description: "Create a new degree",
      content: {
        "application/json": {
          schema: generateSchema(bodyValidator),
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};

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
