import { CreateUser } from "@application/use-cases/users/create-user";
import { Roles } from "@domain/entities/user";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(Roles),
  name: z.string().optional(),
});

export class CreateUserController implements Controller {
  readonly #useCase: CreateUser;

  public constructor(useCase: CreateUser) {
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

    const user = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(user), { status: 201, headers });
  }
}
