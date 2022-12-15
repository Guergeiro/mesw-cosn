import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type ArchiveCoursesByDegreeIdInput = Course["degreeId"];

type ArchiveCoursesByDegreeIdOutput = void;

export class ArchiveCoursesByDegreeId
  implements
    UseCase<ArchiveCoursesByDegreeIdInput, ArchiveCoursesByDegreeIdOutput>
{
  readonly #courseRepository: CourseRepository;
  readonly #kafkaPublisher: KafkaPublisher;

  public constructor(
    courseRepository: CourseRepository,
    kafkaPublisher: KafkaPublisher
  ) {
    this.#courseRepository = courseRepository;
    this.#kafkaPublisher = kafkaPublisher;
  }

  async execute(
    input: ArchiveCoursesByDegreeIdInput
  ): Promise<ArchiveCoursesByDegreeIdOutput> {
    const courses = await this.#courseRepository.find({ degreeId: input });

    const tasks = [];
    for (const course of courses) {
      tasks.push(await this.#courseRepository.archive(course.id));
      tasks.push(
        await this.#kafkaPublisher.send({
          topic: "course",
          key: "archived",
          message: course.id,
        })
      );
    }

    Promise.all(tasks);
  }
}
