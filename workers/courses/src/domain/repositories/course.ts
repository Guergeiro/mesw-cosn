import { Course, CourseFilters } from "@domain/entities/course";

export interface CourseRepository {
  add(course: Course): Promise<void>;
  find(filters?: CourseFilters): Promise<Array<Pick<Course, "id">>>;
  findById(id: Course["id"]): Promise<Course | undefined>;
  archive(id: Course["id"]): Promise<void>;
  patch(
    id: Course["id"],
    props: Partial<
      Pick<Course, "name" | "description" | "abbr" | "ects" | "scientificArea">
    >
  ): Promise<Course>;
}
