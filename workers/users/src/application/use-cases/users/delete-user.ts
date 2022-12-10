import { UsersRepository } from "@domain/repositories/users";
import { UseCase } from "shared-use-cases";

type DeleteUserInput = string;

type DeleteUserOutput = void;

export class DeleteUser implements UseCase<DeleteUserInput, DeleteUserOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute(id: string) {
    await this.#usersRepository.deleteById(id);
  }
}
