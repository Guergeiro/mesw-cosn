import { Degree } from "@domain/entities/degree";
import { DegreeRepository } from "@domain/repositories/degree";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type PatchDegreeInput = {
  id: Degree["id"];
  props: Partial<Pick<Degree, "description" | "goals" | "url" | "abbr">>;
};

type PatchDegreeOutput = Degree;

export class PatchDegree
  implements UseCase<PatchDegreeInput, PatchDegreeOutput>
{
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  async execute({ id, props }: PatchDegreeInput): Promise<PatchDegreeOutput> {
    const exists = await this.#degreeRepository.findById(id);
    if (exists == null) {
      throw new NotFoundException();
    }

    const degree = await this.#degreeRepository.patch(id, props);
    return degree;
  }
}
