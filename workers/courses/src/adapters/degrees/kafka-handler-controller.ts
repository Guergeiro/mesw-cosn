import { ArchiveCoursesByDegreeId } from "@application/use-cases/courses/archive-courses-by-degreeId";
import { ArchiveDegree } from "@application/use-cases/degrees/archive-degree";
import { CreateDegree } from "@application/use-cases/degrees/create-degree";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  id: z.string().uuid(),
  operation: z.enum(["created", "archived"]),
});

export class KafkaHandlerController implements Controller {
  readonly #createDegreeUseCase: CreateDegree;
  readonly #archiveDegreeUseCase: ArchiveDegree;
  readonly #archiveCoursesByDegreeIdUseCase: ArchiveCoursesByDegreeId;

  public constructor(
    createDegreeUseCase: CreateDegree,
    archiveDegreeUseCase: ArchiveDegree,
    archiveCoursesByDegreeIdUseCase: ArchiveCoursesByDegreeId
  ) {
    this.#createDegreeUseCase = createDegreeUseCase;
    this.#archiveDegreeUseCase = archiveDegreeUseCase;
    this.#archiveCoursesByDegreeIdUseCase = archiveCoursesByDegreeIdUseCase;
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

    switch (parsed.data.operation) {
      case "created":
        await this.#createDegreeUseCase.execute({ id: parsed.data.id });
        break;

      case "archived":
        await this.#archiveDegreeUseCase.execute(parsed.data.id);
        await this.#archiveCoursesByDegreeIdUseCase.execute(parsed.data.id);
        break;

      default:
        break;
    }

    return new Response(null, { status: 204 });
  }
}
