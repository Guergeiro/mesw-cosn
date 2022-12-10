import { Degree } from "@domain/entities/degree";
import { DegreeRepository } from "@domain/repositories/degree";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type GetDegreeInput = Degree["id"];

type GetDegreeOutput = Degree;

export class GetDegree implements UseCase<GetDegreeInput, GetDegreeOutput> {
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  public async execute(input: GetDegreeInput) {
    const degree = await this.#degreeRepository.findById(input);
    if (degree == null) {
      throw new NotFoundException();
    }
    return degree;
  }
}
