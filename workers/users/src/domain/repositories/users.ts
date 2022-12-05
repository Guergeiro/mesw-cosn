import { User } from "@domain/entities/user";

export interface UsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
