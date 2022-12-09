import { Degree } from "@domain/entities/degree";

export interface DegreeRepository {
  add(degree: Degree): Promise<void>;
}
