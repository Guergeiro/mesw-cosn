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
  readonly #createUseCase: CreateDegree;
  readonly #archiveUseCase: ArchiveDegree;

  public constructor(
    createUseCase: CreateDegree,
    archiveUseCase: ArchiveDegree
  ) {
    this.#createUseCase = createUseCase;
    this.#archiveUseCase = archiveUseCase;
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
        await this.#createUseCase.execute({ id: parsed.data.id });
        break;

      case "archived":
        await this.#archiveUseCase.execute({ id: parsed.data.id });
        break;

      default:
        break;
    }

    return new Response(null, { status: 204 });
  }
}
