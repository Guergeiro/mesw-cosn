import { UserFilters } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { UseCase } from "shared-use-cases";

type GetUserOutput = string[];

export class GetUsers implements UseCase<undefined, GetUserOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute(filter?: UserFilters) {
    const users = await this.#usersRepository.find(filter);
    return users.map(function ({ id }) {
      return id;
    });
  }
}
