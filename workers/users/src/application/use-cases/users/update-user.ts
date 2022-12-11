import { User, UserProps } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type UpdateUserInput = {
  [K in keyof Pick<UserProps, "name" | "password">]?: UserProps[K];
} & {
  id: User["id"];
};

type UpdateUserOutput = User;

export class UpdateUser implements UseCase<UpdateUserInput, UpdateUserOutput> {
  readonly #usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  public async execute({ id, ...rest }: UpdateUserInput): Promise<User> {
    const user = await this.#usersRepository.findById(id);

    if (user == null) {
      throw new NotFoundException();
    }

    Object.assign(user, rest);

    await this.#usersRepository.save(user);

    return user;
  }
}
