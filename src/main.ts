import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "path";
import postgres from "postgres";
import { AppModule } from "./app.module";

async function migrateDatabase(databaseUrl: string) {
  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);
  const logger = new Logger("Migrations");

  try {
    logger.log("Running migrations...");

    await migrate(db, {
      migrationsFolder: path.join(__dirname, "database", "migrations"),
    });
    logger.log("Migrations complete.");
  } catch (err) {
    logger.error("Migrations failed");
    logger.error(err);
    process.exit(1);
  }
}

async function bootstrap() {
  await migrateDatabase(new ConfigService().get<string>("DATABASE_URL"));

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
