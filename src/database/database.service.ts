import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

@Injectable()
export class DatabaseService {
  public constructor(private readonly configService: ConfigService) {}

  public getDB(): PostgresJsDatabase<typeof schema> {
    // TODO: reuse the same client + connection limit
    const client = postgres(this.configService.get<string>("DATABASE_URL"));

    return drizzle(client, { schema, logger: true });
  }
}
