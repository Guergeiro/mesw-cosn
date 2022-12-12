import { Degree } from "@domain/entities/degree";

export interface DegreeRepository {
  add(degree: Degree): Promise<void>;
  findById(id: Degree["id"]): Promise<Degree | undefined>;
  delete(id: Degree["id"]): Promise<void>;
}
