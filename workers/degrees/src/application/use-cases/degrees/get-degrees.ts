import { DegreeRepository } from "@domain/repositories/degree";
import { UseCase } from "shared-use-cases";
import { DegreeFilters } from "../../../domain/entities/degree";

type GetDegreesOutput = string[];

export class GetDegrees implements UseCase<undefined, GetDegreesOutput> {
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  public async execute(filter?: DegreeFilters) {
    const degrees = await this.#degreeRepository.find(filter);
    return degrees.map(function ({ id }) {
      return id;
    });
  }
}
