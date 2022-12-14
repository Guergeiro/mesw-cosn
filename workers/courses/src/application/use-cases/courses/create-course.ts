import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { DegreeRepository } from "@domain/repositories/degree";
import { BadRequestException } from "shared-exceptions";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type CreateCourseInput = {
  degreeId: string;
  code: string;
  name: string;
  description: string;
  abbr: string;
  ects: number;
  scientificArea: string;
};

type CreateCourseOutput = Course;

export class CreateCourse
  implements UseCase<CreateCourseInput, CreateCourseOutput>
{
  readonly #courseRepository: CourseRepository;
  readonly #degreeRepository: DegreeRepository;
  readonly #kafkaPublisher: KafkaPublisher;

  public constructor(
    courseRepository: CourseRepository,
    degreeRepository: DegreeRepository,
    kafkaPublisher: KafkaPublisher
  ) {
    this.#courseRepository = courseRepository;
    this.#degreeRepository = degreeRepository;
    this.#kafkaPublisher = kafkaPublisher;
  }

  async execute(input: CreateCourseInput): Promise<CreateCourseOutput> {
    const degree = await this.#degreeRepository.findById(input.degreeId);
    if (degree == null) {
      throw new BadRequestException("DegreeId does not exist.");
    }

    const course = new Course({ ...input });
    await this.#courseRepository.add(course);

    await this.#kafkaPublisher.send({
      topic: "course",
      key: "created",
      message: course.id,
    });

    return course;
  }
}
