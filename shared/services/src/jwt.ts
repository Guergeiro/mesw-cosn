import { jwtDecrypt } from "jose";
import { UnauthorizedException } from "shared-exceptions";

export class JwtService {
  readonly #authServicePublicKeyEndpoint: string;

  public constructor(authServicePublicKeyEndpoint: string) {
    this.#authServicePublicKeyEndpoint = authServicePublicKeyEndpoint;
  }

  public async validateJwt(jwtToken: string) {
    const key = await this.getPublicKey();

    const { payload } = await jwtDecrypt(jwtToken, key);
    return payload;
  }

  private async getPublicKey() {
    const res = await fetch(this.#authServicePublicKeyEndpoint);
    if (res.ok !== true) {
      throw new UnauthorizedException();
    }
    const key = await res.arrayBuffer();
    return new Uint8Array(key);
  }
}
