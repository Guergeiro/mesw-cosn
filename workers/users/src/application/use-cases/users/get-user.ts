import { User } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type GetUserInput = User["id"];

type GetUserOutput = User;

export class GetUser implements UseCase<GetUserInput, GetUserOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute(input: GetUserInput) {
    const user = await this.#usersRepository.findById(input);
    if (user == null) {
      throw new NotFoundException();
    }
    return user;
  }
}
