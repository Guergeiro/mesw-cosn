import { Degree } from "@domain/entities/degree";
import { DegreeRepository } from "@domain/repositories/degree";
import { NotFoundException } from "shared-exceptions";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type ArchiveDegreeInput = Degree["id"];

type ArchiveDegreeOutput = void;

export class ArchiveDegree
  implements UseCase<ArchiveDegreeInput, ArchiveDegreeOutput>
{
  readonly #degreeRepository: DegreeRepository;
  readonly #kafkaPublisher: KafkaPublisher;

  public constructor(
    degreeRepository: DegreeRepository,
    kafkaPublisher: KafkaPublisher
  ) {
    this.#degreeRepository = degreeRepository;
    this.#kafkaPublisher = kafkaPublisher;
  }

  async execute(input: ArchiveDegreeInput): Promise<ArchiveDegreeOutput> {
    const degree = await this.#degreeRepository.findById(input);

    if (degree == null) {
      throw new NotFoundException();
    }

    await this.#degreeRepository.archive(input);

    await this.#kafkaPublisher.send({
      topic: "degree",
      key: "archived",
      message: degree.id,
    });
  }
}
