import { Role, User } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { UseCase } from "shared-use-cases";

type ChangeRoleInput = { id: User["id"]; role: Role };

type ChangeRoleOutput = void;

export class ChangeRole implements UseCase<ChangeRoleInput, ChangeRoleOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute({ id, role }: ChangeRoleInput) {
    await this.#usersRepository.changeRole(id, role);
  }
}
