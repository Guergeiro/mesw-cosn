export class KafkaPublisher {
  readonly #url: string;

  constructor(url: string) {
    this.#url = url;
  }

  async send(body: {
    topic: string;
    key: "created" | "archived";
    message: string;
  }): Promise<void> {
    await fetch(`${this.#url}/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
}
