import { GetUsers } from "@application/use-cases/users/get-user";
import { Roles } from "@domain/entities/user";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const queryValidator = z.object({
  role: z.nativeEnum(Roles),
});

export class GetUsersController implements Controller {
  readonly #useCase: GetUsers;

  public constructor(useCase: GetUsers) {
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

    const users = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(users), { status: 200, headers });
  }
}
