import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { MessageModule } from "./message/message.module";

@Module({
  imports: [ConfigModule, DatabaseModule, MessageModule],
})
export class AppModule {}
