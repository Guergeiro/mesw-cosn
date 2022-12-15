import { ArchiveDegreesByFacultyId } from "@application/use-cases/degrees/archive-degrees-by-facultyId";
import { ArchiveFaculty } from "@application/use-cases/faculties/archive-faculty";
import { CreateFaculty } from "@application/use-cases/faculties/create-faculty";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  id: z.number(),
  operation: z.enum(["created", "archived"]),
});

export class KafkaHandlerController implements Controller {
  readonly #createFacultyUseCase: CreateFaculty;
  readonly #archiveFacultyUseCase: ArchiveFaculty;
  readonly #archiveDegreesByFacultyIdUseCase: ArchiveDegreesByFacultyId;

  public constructor(
    createFacultyUseCase: CreateFaculty,
    archiveFacultyUseCase: ArchiveFaculty,
    archiveDegreesByFacultyIdUseCase: ArchiveDegreesByFacultyId
  ) {
    this.#createFacultyUseCase = createFacultyUseCase;
    this.#archiveFacultyUseCase = archiveFacultyUseCase;
    this.#archiveDegreesByFacultyIdUseCase = archiveDegreesByFacultyIdUseCase;
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
        await this.#createFacultyUseCase.execute({ id: parsed.data.id });
        break;

      case "archived":
        await this.#archiveFacultyUseCase.execute(parsed.data.id);
        await this.#archiveDegreesByFacultyIdUseCase.execute(parsed.data.id);
        break;

      default:
        break;
    }

    return new Response(null, { status: 204 });
  }
}
