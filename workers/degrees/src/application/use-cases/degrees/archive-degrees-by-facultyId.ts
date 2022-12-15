import { Degree } from "@domain/entities/degree";
import { DegreeRepository } from "@domain/repositories/degree";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type ArchiveDegreesByFacultyIdInput = Degree["facultyId"];

type ArchiveDegreesByFacultyIdOutput = void;

export class ArchiveDegreesByFacultyId
  implements
    UseCase<ArchiveDegreesByFacultyIdInput, ArchiveDegreesByFacultyIdOutput>
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

  async execute(
    input: ArchiveDegreesByFacultyIdInput
  ): Promise<ArchiveDegreesByFacultyIdOutput> {
    const degrees = await this.#degreeRepository.find({ facultyId: input });

    const tasks = [];
    for (const degree of degrees) {
      tasks.push(await this.#degreeRepository.archive(degree.id));
      tasks.push(
        await this.#kafkaPublisher.send({
          topic: "degree",
          key: "archived",
          message: degree.id,
        })
      );
    }

    Promise.all(tasks);
  }
}
