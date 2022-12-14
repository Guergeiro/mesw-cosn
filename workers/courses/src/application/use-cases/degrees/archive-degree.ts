import { DegreeRepository } from "@domain/repositories/degree";
import { UseCase } from "shared-use-cases";

type ArchiveDegreeInput = {
  id: string;
};

type ArchiveDegreeOutput = void;

export class ArchiveDegree
  implements UseCase<ArchiveDegreeInput, ArchiveDegreeOutput>
{
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  async execute(input: ArchiveDegreeInput): Promise<ArchiveDegreeOutput> {
    await this.#degreeRepository.delete(input.id);
  }
}
