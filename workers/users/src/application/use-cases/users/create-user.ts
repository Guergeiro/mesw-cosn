import { User, UserProps } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { BadRequestException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type CreateUserInput = UserProps;

type CreateUserOutput = User;

export class CreateUser implements UseCase<CreateUserInput, CreateUserOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute({ email, password, role }: CreateUserInput) {
    const previousUser = await this.#usersRepository.findByEmail(email);

    if (previousUser != null) {
      throw new BadRequestException();
    }

    const newUser = new User({ email, password, role });
    await this.#usersRepository.save(newUser);

    return newUser;
  }
}
