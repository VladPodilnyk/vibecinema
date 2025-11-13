import * as fs from "fs";
import { parse } from "csv-parse";
import { CFClient } from "./cf-client";

interface MovieRecord {
  title: string;
  overview: string;
  genre: string;
  year: number;
  imdbRating: number;
  posterLink: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class RAGBuilder {
  private readonly datasetFile = "./datasets/imdb_top_1000.csv";
  private readonly offsetFile = "./rag_builder_offset.txt";
  private recordOffset: number;

  constructor(private readonly client: CFClient) {
    this.recordOffset = 0;
  }

  public recover(): RAGBuilder {
    if (fs.existsSync(this.offsetFile)) {
      console.log("Found stored offset. Recovering...");
      const lastOffset = fs.readFileSync(this.offsetFile).toString();
      this.recordOffset = Number(lastOffset.trim());
      console.log(`Current offset is ${this.recordOffset}`);
    }
    return this;
  }

  public async seedStorage(): Promise<void> {
    let data = await this.parseDataset();

    if (this.recordOffset > 0) {
      console.log("Skipping processed records...");
      data = data.slice(this.recordOffset + 1, data.length);
    }

    await this.runSafe(async () => {
      for await (const movie of data) {
        const embeddings = await this.vectorize(movie);
        const recordId = await this.insertMovieData(movie);
        await this.client.insertVector(recordId, embeddings);
        console.log(`Finished uploading ${this.recordOffset + 1}`);
        this.recordOffset += 1;
        console.log("Sleeping...");
        await sleep(3000);
      }
    });
  }

  private async runSafe(effect: () => Promise<void>): Promise<void> {
    try {
      await effect();
    } catch (e) {
      console.log("RAG builder failed with error: ", e);
      fs.writeFileSync(this.offsetFile, `${this.recordOffset}`);
    }
  }

  private async parseDataset(): Promise<MovieRecord[]> {
    const file = fs.readFileSync(this.datasetFile);
    const content = parse(file, {
      columns: true,
      skip_empty_lines: true,
    });

    const data: MovieRecord[] = [];

    for await (const record of content) {
      // not very safe, but should do the job
      data.push({
        title: record["Series_Title"],
        overview: record["Overview"],
        genre: record["Genre"],
        year: Number(record["Released_Year"]),
        imdbRating: Number(record["IMDB_Rating"]),
        posterLink: record["Poster_Link"],
      });
    }

    return data;
  }

  private vectorize(movie: MovieRecord) {
    return this.client.generateEmbeddings({
      model: "@cf/google/embeddinggemma-300m",
      text: `
            Movie
            Title: ${movie.title}
            Overview: ${movie.overview}
            Genre: ${movie.genre}
        `,
    });
  }

  private async insertMovieData(movie: MovieRecord): Promise<number> {
    const params = [
      movie.title,
      movie.overview,
      movie.genre,
      movie.year.toString(),
      movie.imdbRating.toFixed(1),
      movie.posterLink,
    ];
    const sql = `
        INSERT INTO movies (title, overview, genre, release_year, imdb_rating, poster_link)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const response = await this.client.execD1Query({ sql, params });
    const body = await response.json();
    return body.result[0].meta.last_row_id;
  }
}

const accountId = process.env["CF_ACCOUNT_ID"];
const apiToken = process.env["CF_STORAGE_TOKEN"];

if (accountId === undefined || apiToken === undefined) {
  throw new Error("Environment variables are not found.");
}

const builder = new RAGBuilder(new CFClient(accountId, apiToken));
builder
  .recover()
  .seedStorage()
  .then(() => console.log("Done!"))
  .catch((e) => console.log("Failed with ", e));
