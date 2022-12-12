import { generateSchema } from "@anatine/zod-openapi";
import { PatchCourse } from "@application/use-cases/courses/patch-course";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().max(2000).optional(),
  abbr: z.string().optional(),
  ects: z.number().positive().optional(),
  scientificArea: z.string().optional(),
});

export const patchCourse: PathItemObject = {
  patch: {
    tags: ["courses"],
    responses: {
      "200": {
        description: "Updated course.",
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
      "404": {
        description: "Not Found Exception.",
        content: {
          "application/json": {},
        },
      },
    },
    parameters: [
      {
        name: "courseId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      description: "Patch information from a course.",
      content: {
        "application/json": {
          schema: generateSchema(bodyValidator),
        },
      },
    },
  },
};

export class PatchCourseController implements Controller {
  readonly #useCase: PatchCourse;

  public constructor(useCase: PatchCourse) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id", z.infer<typeof bodyValidator>>) {
    const len = request.headers.get("content-length") || "0";
    if (len === "0") {
      throw new BadRequestException();
    }

    const parsed = bodyValidator.safeParse(await request.json());
    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const { id } = request.param();

    const course = await this.#useCase.execute({ id, props: parsed.data });

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(course), { status: 200, headers });
  }
}
