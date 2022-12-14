import { generateSchema } from "@anatine/zod-openapi";
import { CreateCourse } from "@application/use-cases/courses/create-course";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  degreeId: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().max(2000),
  abbr: z.string(),
  ects: z.number().positive(),
  scientificArea: z.string(),
});

export const createCourse: PathItemObject = {
  post: {
    tags: ["courses"],
    responses: {
      "201": {
        description: "Get created course.",
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
      description: "Create a new course",
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
  readonly #useCase: CreateCourse;

  public constructor(useCase: CreateCourse) {
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

    const course = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(course), { status: 201, headers });
  }
}
