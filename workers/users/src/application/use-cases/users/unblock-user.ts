import { User } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { UseCase } from "shared-use-cases";

type UnblockUserInput = User["id"];

type UnblockUserOutput = void;

export class UnblockUser
  implements UseCase<UnblockUserInput, UnblockUserOutput>
{
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute(id: UnblockUserInput) {
    await this.#usersRepository.unBlockById(id);
  }
}
