import { GetCourses } from "@application/use-cases/courses/get-courses";
import { CourseStatusEnum } from "@domain/enums/course.enum";
import { PathsObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const queryValidator = z
  .object({
    degreeId: z.string().uuid().optional(),
    status: z.nativeEnum(CourseStatusEnum).optional(),
    code: z.string().optional(),
    scientificArea: z.string().optional(),
  })
  .optional();

export const getCourses: PathsObject = {
  get: {
    tags: ["courses"],
    responses: {
      "200": {
        description: "Gets all courses.",
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
        name: "degreeId",
        in: "query",
        schema: {
          type: "string",
        },
      },
      {
        name: "status",
        in: "query",
        schema: {
          type: "string",
          enum: Object.values(CourseStatusEnum),
        },
      },
      {
        name: "code",
        in: "query",
        schema: {
          type: "string",
        },
      },
      {
        name: "scientificArea",
        in: "query",
        schema: {
          type: "string",
        },
      },
    ],
  },
};

export class GetCoursesController implements Controller {
  readonly #useCase: GetCourses;

  public constructor(useCase: GetCourses) {
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

    const courses = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(courses), { status: 200, headers });
  }
}
