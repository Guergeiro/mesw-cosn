import { User } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { BadRequestException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type UserCreateUserInput = {
  email: string;
  password: string;
};

type UserCreateUserOutput = User;

export class UserCreateUser
  implements UseCase<UserCreateUserInput, UserCreateUserOutput>
{
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute({ email, password }: UserCreateUserInput) {
    const previousUser = await this.#usersRepository.findByEmail(email);

    if (previousUser != null) {
      throw new BadRequestException();
    }

    const newUser = new User({ email, password });
    await this.#usersRepository.save(newUser);

    return newUser;
  }
}
