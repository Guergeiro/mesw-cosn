import { Faculty } from "@domain/entities/faculty";
import { FacultyRepository } from "@domain/repositories/faculty";
import { UseCase } from "shared-use-cases";

type ArchiveFacultyInput = Faculty["id"];

type ArchiveFacultyOutput = void;

export class ArchiveFaculty
  implements UseCase<ArchiveFacultyInput, ArchiveFacultyOutput>
{
  readonly #facultyRepository: FacultyRepository;

  public constructor(facultyRepository: FacultyRepository) {
    this.#facultyRepository = facultyRepository;
  }

  async execute(input: ArchiveFacultyInput): Promise<ArchiveFacultyOutput> {
    await this.#facultyRepository.delete(input);
  }
}
