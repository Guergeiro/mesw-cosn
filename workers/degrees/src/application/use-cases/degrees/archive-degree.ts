import { Degree } from "@domain/entities/degree";
import { DegreeRepository } from "@domain/repositories/degree";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type ArchiveDegreeInput = Degree["id"];

export class ArchiveDegree implements UseCase<ArchiveDegreeInput, void> {
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  async execute(input: ArchiveDegreeInput): Promise<void> {
    const degree = await this.#degreeRepository.findById(input);

    if (degree == null) {
      throw new NotFoundException();
    }

    await this.#degreeRepository.archive(input);

    // TODO: Publish to Kafka if status goes to ARCHIVED
  }
}
