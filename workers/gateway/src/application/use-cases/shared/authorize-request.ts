import { Host } from "@domain/entities/host";
import { NotFoundException } from "@domain/exceptions/NotFoundException";
import { HostsRepository } from "@domain/repositories/hosts";
import { UseCase } from "@application/use-cases/use-case";
import { JwtService } from "@application/services/jwt";

type AuthorizeRequestInput = {
  jwtToken: string;
  pathname: string;
};

type AuthorizeRequestOutput = Host;

export class AuthorizeRequest
  implements UseCase<AuthorizeRequestInput, AuthorizeRequestOutput>
{
  readonly #hostsRepository: HostsRepository;
  readonly #jwtService: JwtService;

  public constructor(hostsRepository: HostsRepository, jwtService: JwtService) {
    this.#hostsRepository = hostsRepository;
    this.#jwtService = jwtService;
  }

  public async execute({ pathname, jwtToken }: AuthorizeRequestInput) {
    const payload = await this.#jwtService.validateJwt(jwtToken);
    console.log(payload);
    const host = await this.#hostsRepository.findByPathname(pathname);
    if (host == null) {
      throw new NotFoundException();
    }
    return host;
  }
}
