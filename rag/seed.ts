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

type BaseMovieData = Pick<MovieRecord, "title" | "overview" | "genre">;

interface EmbeddingsData extends BaseMovieData {
  id: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class RAGBuilder {
  private readonly datasetFile = "./datasets/imdb_top_1000.csv";
  private readonly embeddingsFile = "./embeddings.ndjson";

  constructor(private readonly client: CFClient) {}

  public async seedStorage(): Promise<void> {
    let data = await this.parseDataset();

    for await (const movie of data) {
      const recordId = await this.insertMovieData(movie);
      console.log(`Uploaded movie: ${movie.title}, RecordId: ${recordId}`);
      console.log("Sleeping...");
      await sleep(3000);
    }
  }

  public async makeEmbeddings() {
    const dataset = await this.readDatasetFromDb();
    const result: string[] = [];

    for (const value of dataset) {
      const vector = await this.vectorize(value);
      result.push(JSON.stringify({ id: value.id, values: vector }));
      console.log(`Processed record ID: ${value.id} Title: ${value.title}`);
      await sleep(3000);
    }

    fs.writeFileSync(this.embeddingsFile, result.join("\n"));
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

  private vectorize(movie: BaseMovieData) {
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

  private async readDatasetFromDb(): Promise<Array<EmbeddingsData>> {
    const sql = `
        SELECT id, title, overview, genre FROM movies
        LIMIT 2000
    `;
    const response = await this.client.execD1Query({ sql, params: [] });
    const body = await response.json();
    return body.result[0].results;
  }
}

const accountId = process.env["CF_ACCOUNT_ID"];
const apiToken = process.env["CF_STORAGE_TOKEN"];

if (accountId === undefined || apiToken === undefined) {
  throw new Error("Environment variables are not found.");
}

const builder = new RAGBuilder(new CFClient(accountId, apiToken));
builder
  .makeEmbeddings()
  .then(() => console.log("Done!"))
  .catch((e) => console.log("Failed with ", e));
