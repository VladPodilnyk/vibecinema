/**
 * A very simple/dumb wrapper around CF API
 */
export class CFClient {
  constructor(
    private readonly accountId: string,
    private readonly apiToken: string
  ) {}

  public async execD1Query(body: Record<string, any>): Promise<Response> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/1c72ef3f-fbe9-437c-a743-c6cc96a05ad6/query`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Query failed with ${response.statusText}`);
    }
    return response;
  }

  public async insertVector(id: number, values: number[]): Promise<Response> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/vectorize/v2/indexes/vc-vector-index/insert`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-ndjson",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: `{ "id": "${id}", "values": ${values} }`,
    });

    if (!response.ok) {
      throw new Error(`Query failed with ${response.statusText}`);
    }
    return response;
  }

  public async generateEmbeddings(textEmbeddings: {
    text: string;
    model: string;
  }): Promise<number[]> {
    const { text, model } = textEmbeddings;
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Query failed with ${response.statusText}`);
    }

    const data = await response.json();
    return data.result.data[0];
  }
}
