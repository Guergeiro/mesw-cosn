import { UsersRepository } from "@domain/repositories/users";
import { UnauthorizedException } from "shared-exceptions";
import { JwtService } from "shared-services";
import { UseCase } from "shared-use-cases";

type AuthSignInInput = {
  email: string;
  password: string;
};

type AuthSignInOutput = {
  access_token: string;
};

export class AuthSignIn implements UseCase<AuthSignInInput, AuthSignInOutput> {
  readonly #usersRepository: UsersRepository;
  readonly #jwtService: JwtService;

  public constructor(usersRepository: UsersRepository, jwtService: JwtService) {
    this.#usersRepository = usersRepository;
    this.#jwtService = jwtService;
  }

  public async execute({
    email,
    password,
  }: AuthSignInInput): Promise<AuthSignInOutput> {
    const user = await this.#usersRepository.findByEmail(email);

    if (user == null) {
      throw new UnauthorizedException();
    }

    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    return { access_token: await this.#jwtService.sign(user.toJSON()) };
  }
}
