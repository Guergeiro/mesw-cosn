import { Host } from "@domain/entities/host";

export interface HostsRepository {
  findByPathname(pathname: string): Promise<Host | undefined>;
}
