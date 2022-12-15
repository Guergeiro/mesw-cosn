import { DegreeRepository } from "@domain/repositories/degree";
import { UseCase } from "shared-use-cases";
import { Degree } from "../../../domain/entities/degree";

type CreateDegreeInput = {
  id: string;
};

type CreateDegreeOutput = void;

export class CreateDegree
  implements UseCase<CreateDegreeInput, CreateDegreeOutput>
{
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  async execute(input: CreateDegreeInput): Promise<CreateDegreeOutput> {
    const degree = new Degree({ ...input });
    await this.#degreeRepository.add(degree);
  }
}
