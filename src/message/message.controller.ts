import { InjectDatabase } from "@app/database/database.decorator";
import { schema } from "@app/database/schema";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { CreateMessageInput } from "./dto";

@Controller("messages")
export class MessageController {
  public constructor(
    @InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  @Get()
  public async getMessage(): Promise<
    InferSelectModel<typeof schema.messages>[]
  > {
    return await this.db.select().from(schema.messages).execute();
  }

  @Post()
  async createMessage(
    @Body() body: CreateMessageInput,
  ): Promise<InferInsertModel<typeof schema.messages>> {
    return (
      await this.db
        .insert(schema.messages)
        .values({ body: body.message })
        .returning()
    )[0];
  }
}
