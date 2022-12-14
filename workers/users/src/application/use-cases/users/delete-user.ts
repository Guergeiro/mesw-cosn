import { UsersRepository } from "@domain/repositories/users";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type DeleteUserInput = string;

type DeleteUserOutput = void;

export class DeleteUser implements UseCase<DeleteUserInput, DeleteUserOutput> {
  readonly #usersRepository: UsersRepository;
  readonly #kafkaPublisher: KafkaPublisher;

  public constructor(
    usersRepository: UsersRepository,
    kafkaPublisher: KafkaPublisher
  ) {
    this.#usersRepository = usersRepository;
    this.#kafkaPublisher = kafkaPublisher;
  }

  public async execute(id: string) {
    await this.#usersRepository.deleteById(id);

    await this.#kafkaPublisher.send({
      topic: "user",
      key: "archived",
      message: id,
    });
  }
}
