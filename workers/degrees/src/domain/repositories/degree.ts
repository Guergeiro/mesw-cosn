import { Degree, DegreeFilters, DegreeProps } from "@domain/entities/degree";

export interface DegreeRepository {
  add(degree: Degree): Promise<void>;
  find(filters?: DegreeFilters): Promise<Array<Pick<Degree, "id">>>;
  findById(id: Degree["id"]): Promise<Degree | undefined>;
  archive(id: Degree["id"]): Promise<void>;
  patch(
    id: Degree["id"],
    props: Partial<Pick<DegreeProps, "description" | "goals" | "url" | "abbr">>
  ): Promise<Degree>;
}
