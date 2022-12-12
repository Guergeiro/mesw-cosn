import { User } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { UseCase } from "shared-use-cases";

type BlockUserInput = User["id"];

type BlockUserOutput = void;

export class BlockUser implements UseCase<BlockUserInput, BlockUserOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute(id: BlockUserInput) {
    await this.#usersRepository.blockById(id);
  }
}
