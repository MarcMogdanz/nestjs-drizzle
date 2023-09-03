import { Global, Module } from "@nestjs/common";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DATABASE_CONNECTION_KEY } from "./database.decorator";
import { DatabaseService } from "./database.service";
import { schema } from "./schema";

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: DATABASE_CONNECTION_KEY,
      inject: [DatabaseService],
      useFactory: async (
        databaseService: DatabaseService,
      ): Promise<PostgresJsDatabase<typeof schema>> => {
        return databaseService.getDB();
      },
    },
  ],
  exports: [DATABASE_CONNECTION_KEY],
})
export class DatabaseModule {}
