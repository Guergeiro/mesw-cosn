import { Degree } from "@domain/entities/degree";
import { DegreeStatusEnum, EqfLevelEnum } from "@domain/enums/degree.enum";
import { DegreeRepository } from "@domain/repositories/degree";
import { UseCase } from "shared-use-cases";

type CreateDegreeInput = {
  facultyId: string;
  code: string;
  name: string;
  eqfLevel: EqfLevelEnum;
  status: DegreeStatusEnum;
  description: string;
  goals?: string;
  url?: string;
  abbr?: string;
};

type CreateDegreeOutput = Degree;

export class CreateDegree
  implements UseCase<CreateDegreeInput, CreateDegreeOutput>
{
  readonly #degreeRepository: DegreeRepository;

  public constructor(degreeRepository: DegreeRepository) {
    this.#degreeRepository = degreeRepository;
  }

  async execute(input: CreateDegreeInput): Promise<CreateDegreeOutput> {
    // TODO: Verify if facultyId exists

    const degree = new Degree({ ...input });
    await this.#degreeRepository.add(degree);

    // TODO: Publish to Kafka

    return degree;
  }
}
