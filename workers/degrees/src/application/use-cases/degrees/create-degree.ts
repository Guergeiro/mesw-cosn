import { Degree } from "@domain/entities/degree";
import { EqfLevelEnum } from "@domain/enums/degree.enum";
import { DegreeRepository } from "@domain/repositories/degree";
import { FacultyRepository } from "@domain/repositories/faculty";
import { BadRequestException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type CreateDegreeInput = {
  facultyId: string;
  code: string;
  name: string;
  eqfLevel: EqfLevelEnum;
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
  readonly #facultyRepository: FacultyRepository;

  public constructor(
    degreeRepository: DegreeRepository,
    facultyRepository: FacultyRepository
  ) {
    this.#degreeRepository = degreeRepository;
    this.#facultyRepository = facultyRepository;
  }

  async execute(input: CreateDegreeInput): Promise<CreateDegreeOutput> {
    const faculty = await this.#facultyRepository.findById(input.facultyId);
    if (faculty == null) {
      throw new BadRequestException("FacultyId does not exist.");
    }

    const degree = new Degree({ ...input });
    await this.#degreeRepository.add(degree);

    // TODO: Publish to Kafka

    return degree;
  }
}
