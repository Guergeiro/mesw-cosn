import { UsersRepository } from "@domain/repositories/users";
import { UseCase } from "shared-use-cases";

type AuthSignInInput = {
  email: string
  password: string
}

type AuthSignInOutput = {
  access_token: string;
}

export class AuthSignIn implements UseCase<AuthSignIn, AuthSignInOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(
    usersRepository: UsersRepository,
  ) {
    this.#usersRepository = usersRepository;
  }

  public async execute(input: AuthSignIn): Promise<AuthSignInOutput> {
      throw new Error("Method not implemented.");
  }
}
