import { Degree } from "@domain/entities/degree";
import { EqfLevelEnum } from "@domain/enums/degree.enum";
import { DegreeRepository } from "@domain/repositories/degree";
import { FacultyRepository } from "@domain/repositories/faculty";
import { BadRequestException } from "shared-exceptions";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type CreateDegreeInput = {
  facultyId: number;
  code: string;
  name: string;
  eqfLevel: EqfLevelEnum;
  description: string;
  tuition: number;
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
  readonly #kafkaPublisher: KafkaPublisher;

  public constructor(
    degreeRepository: DegreeRepository,
    facultyRepository: FacultyRepository,
    kafkaPublisher: KafkaPublisher
  ) {
    this.#degreeRepository = degreeRepository;
    this.#facultyRepository = facultyRepository;
    this.#kafkaPublisher = kafkaPublisher;
  }

  async execute(input: CreateDegreeInput): Promise<CreateDegreeOutput> {
    const faculty = await this.#facultyRepository.findById(input.facultyId);
    if (faculty == null) {
      throw new BadRequestException("FacultyId does not exist.");
    }

    const degree = new Degree({ ...input });
    await this.#degreeRepository.add(degree);

    await this.#kafkaPublisher.send({
      topic: "degree",
      key: "created",
      message: degree.id,
    });

    return degree;
  }
}
